import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { analyzeWithClaude } from "../../../utils/claude";
import { sessionStore } from "../../../utils/sessionStore";
import { convexHelpers } from "../../../utils/convexClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();
    sessionStore.create(sessionId, {
      status: "processing",
      progress: 0,
      url,
    });

    // Start async processing
    processRoast(sessionId, url);

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error("Error in roast API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processRoast(sessionId: string, url: string) {
  let browser;

  try {
    // Update progress: Starting browser
    sessionStore.update(sessionId, { progress: 10 });

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport to standard desktop resolution
    await page.setViewport({ width: 1920, height: 1080 });

    // Update progress: Navigating to page
    sessionStore.update(sessionId, { progress: 30 });

    // Navigate with timeout
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Update progress: Taking screenshot
    sessionStore.update(sessionId, { progress: 50 });

    // Capture full-page screenshot in JPEG format (quality 70 for smaller API payload)
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: true,
      type: "jpeg",
      quality: 40,
    });

    await browser.close();
    browser = null;

    // 🎯 Upload screenshot to Convex
    console.log("📤 Uploading screenshot to Convex...");
    const storageId = await convexHelpers.uploadScreenshot(screenshot as string);
    console.log("✅ Screenshot uploaded! Storage ID:", storageId);

    // Create roast record in Convex
    const roastId = await convexHelpers.createRoast(url, storageId);
    console.log("✅ Roast record created! Roast ID:", roastId);

    // Update progress: Analyzing with Claude
    sessionStore.update(sessionId, { progress: 70 });

    const analysis = await analyzeWithClaude(screenshot as string);

    // Get screenshot URL from Convex
    const screenshotUrl = await convexHelpers.getScreenshotUrl(storageId);

    // Update progress: Complete
    sessionStore.update(sessionId, {
      status: "complete",
      progress: 100,
      analysis,
      screenshot: screenshotUrl || `data:image/jpeg;base64,${screenshot}`,
    });
  } catch (error) {
    console.error("Error during roast processing:", error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }

    sessionStore.update(sessionId, {
      status: "error",
      progress: 0,
    });
  }
}

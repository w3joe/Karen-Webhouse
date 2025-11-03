import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResults } from "../types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const KAREN_ANALYSIS_PROMPT = `You are Karen, a brutally honest website critic. Analyze the screenshot and return JSON:

{
  "overall_rating": 1-10,
  "roast_summary": "Sarcastic 1-2 sentence overview",
  "karen_opening_line": "Sarcastic greeting",
  "design_flaws": [
    {
      "issue": "Specific component/element name",
      "severity": "critical|high|medium|low",
      "coordinates": {"x": 0, "y": 0, "width": 0, "height": 0},
      "roast": "Snarky comment in 1 phrase only",
      "recommendation": "Actionable fix in 1 sentence"
    }
  ],
  "positive_aspects": ["Any redeeming qualities"]
}

Rules:
- Identify SPECIFIC components (buttons, headers, nav bars, forms, cards, etc.), do not be general.
- Coordinates must tightly bound the problem element (±5px)
- Focus on: poor contrast, bad spacing, misaligned elements, outdated patterns, broken hierarchy, accessibility issues
- Be technical and hilarious`;

export async function analyzeWithClaude(
  screenshotBase64: string
): Promise<AnalysisResults> {
  try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: screenshotBase64,
              },
            },
            {
              type: "text",
              text: KAREN_ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    // Extract the text content from Claude's response
    console.log("📝 Claude response received, content blocks:", message.content.length);
    
    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      console.error("❌ No text content in response:", message.content);
      throw new Error("No text content in Claude's response");
    }

    console.log("📄 Claude text response:", textContent.text.substring(0, 200) + "...");

    // Parse JSON from the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ No JSON found in response:", textContent.text);
      throw new Error("No JSON found in Claude's response");
    }

    console.log("✅ JSON matched, parsing...");
    const analysis: AnalysisResults = JSON.parse(jsonMatch[0]);
    console.log("✅ Analysis complete! Rating:", analysis.overall_rating);

    // Validate and set defaults
    return {
      overall_rating: analysis.overall_rating || 5,
      roast_summary: analysis.roast_summary || "This website is a disaster.",
      karen_opening_line:
        analysis.karen_opening_line ||
        "Oh honey, where do I even start with this mess...",
      design_flaws: analysis.design_flaws || [],
      positive_aspects: analysis.positive_aspects || [],
    };
  } catch (error) {
    console.error("❌ Error analyzing with Claude:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));

    // Return a fallback response with realistic design flaws
    return {
      overall_rating: 2,
      roast_summary:
        "I tried to analyze your website, but it was so bad it broke my AI brain. Based on what I did see before my circuits fried, this is a complete disaster from top to bottom.",
      karen_opening_line:
        "Well, this is awkward. Your website is so terrible I can't even properly roast it, but let me try anyway...",
      design_flaws: [
        {
          issue: "Header navigation is a cluttered mess",
          severity: "critical",
          coordinates: { x: 50, y: 20, width: 1820, height: 80 },
          roast:
            "Your navigation looks like someone threw spaghetti at the wall.",
          recommendation:
            "Simplify your nav to 5-7 key items max.",
        },
        {
          issue: "Hero section with unreadable text overlay",
          severity: "critical",
          coordinates: { x: 100, y: 120, width: 1720, height: 450 },
          roast:
            "White text on a light background? Really? Did you skip the entire chapter on contrast in Design 101? I literally can't read your headline.",
          recommendation:
            "Add a dark overlay to your hero image (rgba(0,0,0,0.5) works wonders), or use a solid background. Make sure your text contrast ratio is at least 4.5:1.",
        },
        {
          issue: "Inconsistent button styles throughout",
          severity: "high",
          coordinates: { x: 150, y: 600, width: 200, height: 50 },
          roast:
            "You have buttons in three different styles on one page. Pick a lane! Are we doing rounded corners or sharp edges? Gradients or flat? Make up your mind!",
          recommendation:
            "Create a consistent button component system. One primary style, one secondary style max. Use your design tokens and stick to them.",
        },
        {
          issue: "Form fields with no labels or placeholders",
          severity: "high",
          coordinates: { x: 300, y: 750, width: 600, height: 280 },
          roast:
            "Ah yes, the mystery form fields. What am I supposed to enter here? My social security number? My deepest fears? A LABEL WOULD HELP.",
          recommendation:
            "Add visible labels above each field. Use placeholders for format examples. Include error states with clear messaging. Basic accessibility, people!",
        },
        {
          issue: "Footer with 47 links nobody asked for",
          severity: "medium",
          coordinates: { x: 50, y: 950, width: 1820, height: 200 },
          roast:
            "Your footer looks like a sitemap had explosive diarrhea. Nobody is reading all those links. NOBODY.",
          recommendation:
            "Organize footer into 3-4 clear categories. Remove redundant links. Keep it under 20 total links. Use proper columns and spacing.",
        },
        {
          issue: "Color palette from the 90s geocities era",
          severity: "high",
          coordinates: { x: 0, y: 0, width: 1920, height: 1080 },
          roast:
            "Neon green, hot pink, and electric blue? What is this, a rave? My eyes are bleeding. Color theory exists for a reason.",
          recommendation:
            "Choose a proper color palette with 2-3 main colors max. Use a tool like Coolors or Adobe Color. Stick to colors that don't cause seizures.",
        },
        {
          issue: "Text blocks with zero line spacing",
          severity: "medium",
          coordinates: { x: 200, y: 400, width: 800, height: 300 },
          roast:
            "Your paragraphs look like they're having a group hug. Ever heard of line-height? White space? Readability?",
          recommendation:
            "Set line-height to 1.5-1.8 for body text. Add margin between paragraphs. Break up long text blocks. Let your content breathe!",
        },
        {
          issue: "Mobile responsiveness is nonexistent",
          severity: "critical",
          coordinates: { x: 0, y: 0, width: 1920, height: 1080 },
          roast:
            "Did you even TEST this on mobile? Everything overlaps, text is cut off, and I have to scroll horizontally like it's 2003.",
          recommendation:
            "Use mobile-first responsive design. Test on actual devices. Use CSS media queries. Make touch targets at least 44x44px. This is not optional anymore.",
        },
      ],
      positive_aspects: ["At least the page loaded... eventually."],
    };
  }
}

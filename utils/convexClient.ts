import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Initialize Convex client for local development
// When running locally, use: http://localhost:3210
// For production, use your deployment URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3210";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  console.log("⚠️  Using local Convex: http://localhost:3210");
  console.log("   Make sure 'npx convex dev' is running!");
}

export const convexClient = new ConvexHttpClient(convexUrl);

/**
 * Helper functions for your specific use case:
 * 1. Upload base64 screenshot
 * 2. Retrieve screenshot by ID
 */
export const convexHelpers = {
  /**
   * Upload a base64 screenshot to Convex storage
   * @param base64String - The base64 string (with or without data URI prefix)
   * @returns storageId - Use this to reference the image later
   */
  async uploadScreenshot(base64String: string): Promise<Id<"_storage">> {
    try {
      // Remove data URI prefix if present
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
      
      // Convert base64 to Blob
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/jpeg" });

      // Step 1: Generate upload URL
      const uploadUrl = await convexClient.mutation(api.roasts.generateUploadUrl);

      // Step 2: Upload blob to Convex storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const { storageId } = await uploadResponse.json();
      return storageId as Id<"_storage">;
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      throw error;
    }
  },

  /**
   * Get a screenshot URL by storage ID
   * @param storageId - The ID returned from uploadScreenshot
   * @returns Public URL to access the image (valid for 1 hour)
   */
  async getScreenshotUrl(storageId: Id<"_storage">): Promise<string | null> {
    try {
      // Convex generates temporary signed URLs automatically
      const url = await convexClient.query(api.roasts.getScreenshotUrl, {
        storageId,
      });
      return url;
    } catch (error) {
      console.error("Error getting screenshot URL:", error);
      return null;
    }
  },

  /**
   * Create a roast record (links URL + screenshot)
   * @param url - Website URL
   * @param screenshotId - Storage ID from uploadScreenshot
   * @returns roastId - Use this to track the roast
   */
  async createRoast(
    url: string,
    screenshotId: Id<"_storage">,
    userId?: string
  ): Promise<Id<"roasts">> {
    return await convexClient.mutation(api.roasts.createRoast, {
      url,
      screenshotId,
      userId,
    });
  },

  /**
   * Get a roast by ID (includes screenshot URL)
   * @param roastId - The roast ID
   * @returns Roast with screenshot URL attached
   */
  async getRoastById(roastId: Id<"roasts">) {
    return await convexClient.query(api.roasts.getRoastById, {
      roastId,
    });
  },

  /**
   * Update roast with analysis results from Claude
   */
  async updateRoastAnalysis(
    roastId: Id<"roasts">,
    analysis: {
      overallRating: number;
      roastSummary: string;
      karenOpeningLine: string;
      designFlaws: any[];
      positiveAspects: string[];
    }
  ) {
    return await convexClient.mutation(api.roasts.updateRoastAnalysis, {
      roastId,
      ...analysis,
    });
  },

  /**
   * Mark roast as failed
   */
  async markRoastFailed(roastId: Id<"roasts">) {
    return await convexClient.mutation(api.roasts.markRoastFailed, {
      roastId,
    });
  },
};

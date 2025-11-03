import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * MUTATIONS - Functions that modify database state
 */

/**
 * Generate a signed upload URL for screenshot upload
 * This allows direct upload to Convex file storage from the server
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Create a new roast record
 * Called after screenshot has been uploaded to storage
 */
export const createRoast = mutation({
  args: {
    url: v.string(),
    screenshotId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const roastId = await ctx.db.insert("roasts", {
      url: args.url,
      screenshotId: args.screenshotId,
      status: "completed",
      createdAt: Date.now(),
    });
    
    return roastId;
  },
});

/**
 * QUERIES - Functions that read database state
 */

/**
 * Get roasts for splash page gallery
 * Returns recent roasts with screenshot URLs
 */
export const getSplashPageRoasts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 24;
    
    // Get most recent completed roasts
    const roasts = await ctx.db
      .query("roasts")
      .withIndex("by_status_created", (q) => q.eq("status", "completed"))
      .order("desc")
      .take(limit);
    
    // Attach screenshot URLs to each roast
    const roastsWithUrls = await Promise.all(
      roasts.map(async (roast) => {
        const screenshotUrl = await ctx.storage.getUrl(roast.screenshotId);
        return {
          ...roast,
          screenshotUrl,
        };
      })
    );
    
    return roastsWithUrls;
  },
});

/**
 * Get screenshot URL from storage ID
 * Simple helper for retrieving screenshot URLs
 */
export const getScreenshotUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});


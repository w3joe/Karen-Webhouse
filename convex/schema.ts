import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema for Karen's WebHouse
 * Simple schema for storing screenshots and basic roast info
 */
export default defineSchema({
  roasts: defineTable({
    // Website Information
    url: v.string(),
    screenshotId: v.id("_storage"),
    
    // Metadata
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_status_created", ["status", "createdAt"]),
});


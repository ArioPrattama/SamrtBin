import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Users + accounts + sessions for Convex Auth
  ...authTables,

  // App profile data layered on top of the auth user
  profiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
    ecoPoints: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // SmartBin devices
  bins: defineTable({
    name: v.string(),
    location: v.string(),
    lat: v.number(),
    lng: v.number(),
    fillLevel: v.number(),
    capacity: v.number(),
    lastCollected: v.string(),
    status: v.union(
      v.literal("full"),
      v.literal("medium"),
      v.literal("normal"),
    ),
    batteryLevel: v.number(),
  }),

  // Earn / redeem transactions
  transactions: defineTable({
    userId: v.id("users"),
    binId: v.optional(v.id("bins")),
    rewardId: v.optional(v.id("rewards")),
    points: v.number(),
    type: v.union(v.literal("earn"), v.literal("redeem")),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

  rewards: defineTable({
    name: v.string(),
    description: v.string(),
    pointsRequired: v.number(),
    category: v.string(),
    image: v.string(),
    stock: v.number(),
    validUntil: v.string(),
  }),
});

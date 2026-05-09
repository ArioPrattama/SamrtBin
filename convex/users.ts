import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Get the currently signed-in user + profile (or null when signed out).
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
      role: profile?.role ?? "user",
      ecoPoints: profile?.ecoPoints ?? 0,
      createdAt: profile?.createdAt ?? user._creationTime,
    };
  },
});

// Ensure a profile row exists for the signed-in user.
// Call this once after sign-up / first sign-in.
export const ensureProfile = mutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");

    // Update display name if provided.
    if (name) {
      const user = await ctx.db.get(userId);
      if (user && !user.name) {
        await ctx.db.patch(userId, { name });
      }
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert("profiles", {
      userId,
      role: "user",
      ecoPoints: 0,
      createdAt: Date.now(),
    });
  },
});

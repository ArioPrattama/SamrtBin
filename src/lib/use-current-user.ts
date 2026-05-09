"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Returns the currently signed-in user's profile, or `undefined` while
 * loading and `null` when signed out.
 */
export function useCurrentUser() {
  return useQuery(api.users.me);
}

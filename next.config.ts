import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase", "firebase-admin", "better-auth"],
  // Turbopack is default in Next.js 16 — explicit config silences the warning
  turbopack: {},
};

export default nextConfig;

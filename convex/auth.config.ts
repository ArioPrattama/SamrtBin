// JWT issuer config for Convex Auth.
// CONVEX_SITE_URL is automatically populated when you run `npx convex dev`.
const authConfig = {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;

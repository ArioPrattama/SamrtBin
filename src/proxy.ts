import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtectedUserRoute = createRouteMatcher(["/dashboard(.*)"]);
const isProtectedAdminRoute = createRouteMatcher([
  "/admin/dashboard(.*)",
  "/admin/bins(.*)",
  "/admin/routes(.*)",
  "/admin/analytics(.*)",
]);
const isAuthPage = createRouteMatcher(["/login", "/register"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthed = await convexAuth.isAuthenticated();

  if (isProtectedUserRoute(request) && !isAuthed) {
    return nextjsMiddlewareRedirect(request, "/login");
  }

  // Admin gate: prototype uses an `admin_session` cookie set by /admin login.
  if (isProtectedAdminRoute(request)) {
    const adminSession = request.cookies.get("admin_session")?.value;
    if (!adminSession && !isAuthed) {
      return nextjsMiddlewareRedirect(request, "/admin");
    }
  }

  if (isAuthPage(request) && isAuthed) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

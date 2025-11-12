import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (no sign-in required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/courses",
  "/courses/(.*)",
  "/api/translate",
  "/api/translate/batch",
]);

// Routes to ignore (webhooks, etc.)
const isIgnoredRoute = createRouteMatcher([
  "/api/webhook/clerk",
]);

export default clerkMiddleware((auth, req) => {
  if (isIgnoredRoute(req)) return;   // Skip Clerk completely for webhooks
  if (isPublicRoute(req)) return;    // Allow unauthenticated access
  auth().protect();                  // Protect everything else
});

export const config = {
  matcher: [
    // Clerk’s exhaustive matcher pattern for performance & safety
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  try {
    const pathname = req.nextUrl.pathname;

    if (!auth().userId && isProtectedRoute(pathname)) {
      return auth().redirectToSignIn();
    }

    if (
      auth().userId &&
      !auth().orgId &&
      pathname !== "/onboarding" &&
      pathname !== "/"
    ) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error); // This will show in Vercel logs
    return NextResponse.next(); // Prevents crashing
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)",
    "/(api|trpc)(.*)",
  ],
};
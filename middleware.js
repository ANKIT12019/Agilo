import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  beforeAuth: (req) => {
    const url = req.nextUrl;
    const pathname = url.pathname;

    const isProtected = [
      "/onboarding",
      "/organisation",
      "/project",
      "/issue",
      "/sprint",
    ].some((prefix) => pathname.startsWith(prefix));

    if (!req.auth?.userId && isProtected) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (
      req.auth?.userId &&
      !req.auth?.orgId &&
      pathname !== "/onboarding" &&
      pathname !== "/"
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // exclude static files
    "/(api|trpc)(.*)",        // include API routes
  ],
};

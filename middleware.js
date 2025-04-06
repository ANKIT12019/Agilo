const { authMiddleware } = require("@clerk/nextjs/server");
const { NextResponse } = require("next/server");

module.exports = authMiddleware({
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

module.exports.config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};

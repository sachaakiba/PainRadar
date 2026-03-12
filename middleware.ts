import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Dashboard auth protection
  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.match(/^\/(en|fr)\/dashboard/);

  if (isDashboard) {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");
    if (!sessionCookie) {
      const locale = pathname.startsWith("/fr") ? "fr" : "en";
      return NextResponse.redirect(
        new URL(locale === "en" ? "/signin" : "/fr/signin", request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const BETA_COOKIE_NAME = "painradar_beta";

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

  // Coming soon gate — show coming-soon page unless bypass is active
  if (pathname === "/coming-soon") {
    return NextResponse.next();
  }

  const accessParam = request.nextUrl.searchParams.get("painradar");
  const betaCookie = request.cookies.get(BETA_COOKIE_NAME)?.value;
  const bypassValue = "access-admin";

  // Grant access: URL param ?painradar=access-admin → set cookie, redirect to clean URL
  if (accessParam === bypassValue) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("painradar");
    const res = NextResponse.redirect(url);
    res.cookies.set(BETA_COOKIE_NAME, bypassValue, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res;
  }

  // Grant access: valid cookie already set
  if (betaCookie === bypassValue) {
    // Fall through to dashboard auth + intl
  } else {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
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

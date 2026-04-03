import { decodeMockSession, MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_APP_ROUTES = new Set(["/app/login"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  if (PUBLIC_APP_ROUTES.has(pathname)) {
    const existing = decodeMockSession(request.cookies.get(MOCK_AUTH_COOKIE)?.value);
    if (existing) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
    return NextResponse.next();
  }

  const rawCookie = request.cookies.get(MOCK_AUTH_COOKIE)?.value;
  const session = decodeMockSession(rawCookie);

  if (!session) {
    const loginUrl = new URL("/app/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"]
};

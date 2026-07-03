import {
  type CookieStore,
  updateSession,
} from "@insforge/sdk/ssr/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { getInsforgeConfig } from "@/lib/insforge-config";

const protectedPrefixes = ["/dashboard", "/profile", "/find-jobs"];

function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function copyResponseCookies(
  source: NextResponse,
  target: NextResponse,
): NextResponse {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }

  return target;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request });
  // The SDK documents NextRequest.cookies here, but its CookieStore type
  // currently declares a broader set() overload than Next.js exposes.
  const requestCookies = request.cookies as unknown as CookieStore;
  const { accessToken } = await updateSession({
    ...getInsforgeConfig(),
    requestCookies,
    responseCookies: response.cookies,
  });
  const { pathname } = request.nextUrl;

  if (!accessToken && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    return copyResponseCookies(response, redirectResponse);
  }

  if (accessToken && pathname === "/login") {
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
    return copyResponseCookies(response, redirectResponse);
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/profile/:path*",
    "/find-jobs/:path*",
  ],
};

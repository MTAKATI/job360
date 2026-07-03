import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getInsforgeConfig } from "@/lib/insforge-config";

const UNIQUE_VIOLATION_CODE = "23505";

async function ensureProfile(
  response: NextResponse,
  user: { id: string; email: string; profile: { name?: string } | null },
): Promise<void> {
  const insforge = createServerClient({
    ...getInsforgeConfig(),
    cookies: response.cookies,
  });

  const { error } = await insforge.database.from("profiles").insert([
    {
      id: user.id,
      email: user.email,
      full_name: user.profile?.name ?? null,
    },
  ]);

  if (error && error.code !== UNIQUE_VIOLATION_CODE) {
    console.error("[api/auth/callback] profile creation", error);
  }
}

function redirectToLogin(request: NextRequest, error: string): NextResponse {
  const response = NextResponse.redirect(
    new URL(`/login?error=${error}`, request.url),
  );
  response.cookies.delete("insforge_code_verifier");
  return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const code = request.nextUrl.searchParams.get("insforge_code");
    const cookieStore = await cookies();
    const verifier = cookieStore.get("insforge_code_verifier")?.value;

    if (!code || !verifier) {
      return redirectToLogin(request, "oauth_missing");
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    const auth = createAuthActions({
      ...getInsforgeConfig(),
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });
    const { data, error } = await auth.exchangeOAuthCode(code, verifier);

    if (error) {
      console.error("[api/auth/callback]", error);
      return redirectToLogin(request, "oauth_callback");
    }

    if (data?.user) {
      await ensureProfile(response, data.user);
    }

    response.cookies.delete("insforge_code_verifier");
    return response;
  } catch (error: unknown) {
    console.error("[api/auth/callback]", error);
    return redirectToLogin(request, "oauth_callback");
  }
}

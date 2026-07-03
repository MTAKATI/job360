"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAppUrl, getInsforgeConfig } from "@/lib/insforge-config";

export type OAuthProvider = "google" | "github";

function getOAuthProvider(formData: FormData): OAuthProvider | null {
  const provider = formData.get("provider");
  return provider === "google" || provider === "github" ? provider : null;
}

export async function signInWithOAuth(formData: FormData): Promise<never> {
  const provider = getOAuthProvider(formData);

  if (!provider) {
    redirect("/login?error=oauth_start");
  }

  let oauthUrl: string | null = null;

  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({
      ...getInsforgeConfig(),
      cookies: cookieStore,
    });
    const redirectTo = new URL(
      "/api/auth/callback",
      getAppUrl(),
    ).toString();
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo,
      skipBrowserRedirect: true,
      ...(provider === "google"
        ? { additionalParams: { prompt: "select_account" } }
        : {}),
    });

    if (error || !data.url || !data.codeVerifier) {
      console.error("[actions/auth/signInWithOAuth]", error);
    } else {
      cookieStore.set("insforge_code_verifier", data.codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600,
      });
      oauthUrl = data.url;
    }
  } catch (error: unknown) {
    console.error("[actions/auth/signInWithOAuth]", error);
  }

  if (!oauthUrl) {
    redirect("/login?error=oauth_start");
  }

  redirect(oauthUrl);
}

export async function signOut(): Promise<never> {
  let failed = false;

  try {
    const auth = createAuthActions({
      ...getInsforgeConfig(),
      cookies: await cookies(),
    });
    const { error } = await auth.signOut();
    failed = Boolean(error);

    if (error) {
      console.error("[actions/auth/signOut]", error);
    }
  } catch (error: unknown) {
    failed = true;
    console.error("[actions/auth/signOut]", error);
  }

  if (failed) {
    redirect("/dashboard?error=signout");
  }

  redirect("/login");
}

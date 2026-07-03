const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

export type InsforgeConfig = {
  baseUrl: string;
  anonKey: string;
};

export function getInsforgeConfig(): InsforgeConfig {
  if (!insforgeUrl || !insforgeAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY.",
    );
  }

  return {
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
  };
}

export function getAppUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL.");
  }

  return appUrl;
}

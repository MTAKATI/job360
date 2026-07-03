import "server-only";

import type { InsForgeClient } from "@insforge/sdk";
import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { getInsforgeConfig } from "./insforge-config";

export async function createInsforgeServer(): Promise<InsForgeClient> {
  return createServerClient({
    ...getInsforgeConfig(),
    cookies: await cookies(),
  });
}

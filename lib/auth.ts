import "server-only";

import type { InsForgeClient } from "@insforge/sdk";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";

export type CurrentUser = Awaited<
  ReturnType<InsForgeClient["auth"]["getCurrentUser"]>
>["data"]["user"];

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error) {
    return null;
  }

  return data.user;
});

export async function requireUser(): Promise<NonNullable<CurrentUser>> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

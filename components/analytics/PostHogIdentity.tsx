"use client";

import { useEffect } from "react";
import { identifyPostHogUser } from "@/lib/posthog-client";

type PostHogIdentityProps = {
  userId: string;
};

export function PostHogIdentity({
  userId,
}: PostHogIdentityProps): null {
  useEffect(() => {
    identifyPostHogUser(userId);
  }, [userId]);

  return null;
}

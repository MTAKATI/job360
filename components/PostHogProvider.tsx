"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { isPostHogConfigured, posthog } from "@/lib/posthog-client";

function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const postHogClient = usePostHog();

  useEffect(() => {
    if (!pathname || !postHogClient || !isPostHogConfigured()) {
      return;
    }

    const url = `${window.location.origin}${pathname}${searchParams?.toString() ? `?${searchParams}` : ""}`;
    postHogClient.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, postHogClient]);

  return null;
}

type PostHogProviderProps = {
  children: ReactNode;
};

export function PostHogProvider({
  children,
}: PostHogProviderProps): ReactNode {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

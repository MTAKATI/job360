import "client-only";

import posthog from "posthog-js";
import type {
  PostHogEventName,
  PostHogEventProperties,
} from "@/lib/posthog-events";

export function isPostHogConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );
}

export function capturePostHogEvent<EventName extends PostHogEventName>(
  event: EventName,
  properties: PostHogEventProperties[EventName],
): void {
  if (!isPostHogConfigured()) {
    return;
  }

  posthog.capture(event, properties);
}

export function identifyPostHogUser(userId: string): void {
  if (isPostHogConfigured()) {
    posthog.identify(userId);
  }
}

export function resetPostHogUser(): void {
  if (isPostHogConfigured()) {
    posthog.reset();
  }
}

export { posthog };

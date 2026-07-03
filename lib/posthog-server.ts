import "server-only";

import { PostHog } from "posthog-node";
import type {
  PostHogEventName,
  PostHogEventProperties,
} from "@/lib/posthog-events";

function createPostHogServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    return null;
  }

  return new PostHog(key, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function capturePostHogServerEvent<
  EventName extends PostHogEventName,
>(
  distinctId: string,
  event: EventName,
  properties: PostHogEventProperties[EventName],
): Promise<void> {
  const posthog = createPostHogServer();

  if (!posthog) {
    return;
  }

  try {
    posthog.capture({
      distinctId,
      event,
      properties,
    });
  } catch (error: unknown) {
    console.error("[lib/posthog-server/capturePostHogServerEvent]", error);
  } finally {
    try {
      await posthog.shutdown();
    } catch (error: unknown) {
      console.error("[lib/posthog-server/shutdown]", error);
    }
  }
}

"use client";

import { createBrowserClient } from "@insforge/sdk/ssr";
import { getInsforgeConfig } from "./insforge-config";

export const insforge = createBrowserClient(getInsforgeConfig());

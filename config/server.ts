import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { assert } from "@/modules/common-utils";

export const IS_NEXT_BUILD = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

// TODO: A really bad workaround for `next build` requiring env to be set...
export function runtimeAssert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!IS_NEXT_BUILD) assert(condition, message);
}

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
runtimeAssert(DATABASE_URL, "DATABASE_URL is required");

export const REDIS_URL: string = process.env.REDIS_URL || "";
runtimeAssert(REDIS_URL, "REDIS_URL is required");

export const REDIS_USERNAME: string | undefined =
  process.env.REDIS_USERNAME || undefined;
export const REDIS_PASSWORD: string | undefined =
  process.env.REDIS_PASSWORD || undefined;

export const LEGACY_DATABASE_URL: string | undefined =
  process.env.LEGACY_DATABASE_URL || undefined;

export const DATABASE_MAX_CONNECTIONS = Number(
  process.env.DATABASE_MAX_CONNECTIONS || "4"
);

export const IPFS_HTTP_API_ORIGIN: string =
  process.env.IPFS_HTTP_API_ORIGIN || "";
runtimeAssert(IPFS_HTTP_API_ORIGIN, "IPFS_HTTP_API_ORIGIN is required");

import { PHASE_PRODUCTION_BUILD } from "next/constants";

import {
  parseBaseUrl,
  parseInteger,
  parseStringByRegex,
} from "./utils/parsers";
import { parseEnv, parseEnv$Optional } from "./utils/wrappers";

import { assert } from "@/modules/common-utils";
import { createSecretKey, KeySet } from "@/modules/crypt";

export const IS_NEXT_BUILD = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

// never() is something that will never be accessed
// We use `never` as the default type for `T` since we want to use the other type in the branch condition.
export function never<T = never>(): T {
  return undefined as T;
}

export const DATABASE_URL = IS_NEXT_BUILD
  ? never()
  : parseEnv({
      label: "DATABASE_URL",
      input: process.env.DATABASE_URL,
      parser: parseStringByRegex(/^postgres:.*$/),
    });

export const REDIS_URL = IS_NEXT_BUILD
  ? never()
  : parseEnv({
      label: "REDIS_URL",
      input: process.env.REDIS_URL,
      parser: parseStringByRegex(/^.+$/),
    });

export const REDIS_USERNAME = parseEnv$Optional({
  label: "REDIS_USERNAME",
  input: process.env.REDIS_USERNAME,
  parser: parseStringByRegex(/^[ -~]+$/),
  defaultValue: undefined,
});

export const REDIS_PASSWORD = parseEnv$Optional({
  label: "REDIS_PASSWORD",
  input: process.env.REDIS_PASSWORD,
  parser: parseStringByRegex(/^[ -~]+$/),
  defaultValue: undefined,
});

export const LEGACY_DATABASE_URL = parseEnv$Optional({
  label: "LEGACY_DATABASE_URL",
  input: process.env.LEGACY_DATABASE_URL,
  parser: parseStringByRegex(/^postgres:.*$/),
  defaultValue: undefined,
});

export const DATABASE_MAX_CONNECTIONS = parseEnv$Optional({
  label: "DATABASE_MAX_CONNECTIONS",
  input: process.env.DATABASE_MAX_CONNECTIONS,
  parser: parseInteger(),
  defaultValue: 4,
});

export const IPFS_HTTP_API_ORIGIN = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional({
      label: "IPFS_HTTP_API_ORIGIN",
      input: process.env.IPFS_HTTP_API_ORIGIN,
      parser: parseBaseUrl(),
      defaultValue: "",
    });

export const KREATE_CONTENT_KEYS = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional<KeySet>({
      label: "KREATE_CONTENT_KEYS",
      input: process.env.KREATE_CONTENT_KEYS,
      parser: (text) =>
        new Map(
          text.split(",").map((term) => {
            const [kid, keyText] = term.trim().split(":", 2);
            assert(kid, "Content key id must be specified");
            return [kid, createSecretKey("cipher", keyText)];
          })
        ),
      defaultValue: new Map(),
    });

export const KREATE_CONTENT_DEFAULT_KEY_ID = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional({
      label: "KREATE_CONTENT_DEFAULT_KEY_ID",
      input: process.env.KREATE_CONTENT_DEFAULT_KEY_ID,
      parser: parseStringByRegex(/^[ -~]+$/),
      defaultValue: undefined,
    });

export const KREATE_CONTENT_HMAC_SECRET = IS_NEXT_BUILD
  ? never()
  : parseEnv({
      label: "KREATE_CONTENT_HMAC_SECRET",
      input: process.env.KREATE_CONTENT_HMAC_SECRET,
      parser: (text) =>
        createSecretKey("hmac", parseStringByRegex(/^[ -~]+$/)(text)),
    });

if (!IS_NEXT_BUILD) {
  if (!KREATE_CONTENT_KEYS.size)
    console.warn("! KREATE_CONTENT_KEYS is not set");
  if (!KREATE_CONTENT_DEFAULT_KEY_ID)
    console.warn("! KREATE_CONTENT_DEFAULT_KEY_ID is not set");
}

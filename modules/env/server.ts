import { PHASE_PRODUCTION_BUILD } from "next/constants";

import {
  parseBaseUrl,
  parseInteger,
  parseStringByRegex,
} from "./utils/parsers";
import { parseEnv, parseEnv$Optional } from "./utils/wrappers";

import { assert } from "@/modules/common-utils";
import { createSecretKey, KeyId, KeySet } from "@/modules/crypt";

export const IS_NEXT_BUILD = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

// never() is something that will never be accessed
function never<T>(): T {
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
      parser: parseStringByRegex(/^redis:.*$/),
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

export const TEIKI_CONTENT_KEYS: KeySet = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional({
      label: "TEIKI_CONTENT_KEYS",
      input: process.env.TEIKI_CONTENT_KEYS,
      parser: (text) =>
        new Map(
          text.split(",").map((term) => {
            const [kid, keyText] = term.trim().split(":", 2);
            assert(kid, "Content key id must be specified");
            return [kid, createSecretKey("content", keyText)];
          })
        ),
      defaultValue: new Map(),
    });

export const TEIKI_CONTENT_DEFAULT_KEY_ID = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional<KeyId | undefined>({
      label: "TEIKI_CONTENT_DEFAULT_KEY_ID",
      input: process.env.TEIKI_CONTENT_DEFAULT_KEY_ID,
      parser: parseStringByRegex(/^[ -~]+$/),
      defaultValue: undefined,
    });

export const TEIKI_HMAC_SECRET = IS_NEXT_BUILD
  ? never()
  : parseEnv({
      label: "TEIKI_HMAC_SECRET",
      input: process.env.TEIKI_HMAC_SECRET,
      parser: parseStringByRegex(/^[ -~]+$/),
    });

if (!IS_NEXT_BUILD) {
  if (!TEIKI_CONTENT_KEYS.size) console.warn("! TEIKI_CONTENT_KEYS is not set");
  if (!TEIKI_CONTENT_DEFAULT_KEY_ID)
    console.warn("! TEIKI_CONTENT_DEFAULT_KEY_ID is not set");
}

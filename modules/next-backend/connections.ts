// TODO: Duplicated of teiki-index/src/db.ts
import Redis from "ioredis";
import postgres from "postgres";
import prexit from "prexit";

import {
  DATABASE_MAX_CONNECTIONS,
  DATABASE_URL,
  IS_NEXT_BUILD,
  LEGACY_DATABASE_URL,
  REDIS_PASSWORD,
  REDIS_URL,
  REDIS_USERNAME,
} from "../../config/server";

import { options, Sql } from "./db";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const POSTGRES_OPTIONS = options({
  max: DATABASE_MAX_CONNECTIONS,
  idle_timeout: IS_DEVELOPMENT ? 30 : 60,
  max_lifetime: 60 * (IS_DEVELOPMENT ? 5 : 30),
});

// https://github.com/vercel/next.js/issues/7811
// TODO: Export this to a new module, because the issue
// happens regularly with next.js in development mode.
function service<T>(name: string, init: () => T): T {
  if (IS_DEVELOPMENT) {
    const globalRecord = global as Record<string, unknown>;
    if (!(name in globalRecord)) globalRecord[name] = init();
    return globalRecord[name] as T;
  }
  return init();
}

// FIXME: Next.js is freaking weird, this module is loaded twice
// One for /pages/api/... routes
// One for /pages/... routes (SSR)

// TODO: A really bad workaround for `next build` requiring env to be set...
export const db = service("__db__", () =>
  IS_NEXT_BUILD
    ? (undefined as unknown as Sql)
    : postgres(DATABASE_URL, POSTGRES_OPTIONS)
);

// TODO: Remove this after we go mainnet
export const dbLegacy = service("__db_legacy__", () =>
  IS_NEXT_BUILD
    ? (undefined as unknown as Sql)
    : LEGACY_DATABASE_URL
    ? postgres(LEGACY_DATABASE_URL, {
        ...POSTGRES_OPTIONS,
        max: Math.round(DATABASE_MAX_CONNECTIONS / 2),
      })
    : null
);

export const redis = service("__redis__", () =>
  IS_NEXT_BUILD
    ? (undefined as unknown as Redis)
    : new Redis(REDIS_URL, {
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        connectionName: "web",
        enableAutoPipelining: true,
        enableReadyCheck: !IS_DEVELOPMENT,
      })
);

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  prexit(async (signal, error, idk) => {
    console.warn("$ EXIT:", signal, error, idk);
    await Promise.all([
      db.end({ timeout: 5 }),
      dbLegacy?.end({ timeout: 5 }),
      redis.quit(),
    ]);
    console.log("$ END");
  });
}

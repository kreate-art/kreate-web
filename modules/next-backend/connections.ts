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
import { toJson, fromJson } from "../json-utils";

export { postgres };

export type SqlTypes = Record<string, postgres.PostgresType>;

const POSTGRES_BASE_OPTIONS: postgres.Options<never> = {
  connection: {
    application_name: "teiki/web",
  },
  // eslint-disable-next-line import/no-named-as-default-member
  transform: postgres.camel,
  onnotice: (notice) => {
    console.warn(notice);
  },
  onparameter: (key, value) => {
    console.warn(`(:) ${key} = ${value}`);
  },
};

const POSTGRES_BASE_TYPES = {
  // eslint-disable-next-line import/no-named-as-default-member
  bigint: postgres.BigInt,
  json: {
    // Override postgres'
    to: 114, // json
    from: [114, 3802], // json, jsonb
    serialize: toJson,
    parse: fromJson,
  } as postgres.PostgresType<unknown>,
};

export function options<T extends SqlTypes = Record<string, never>>(
  options: postgres.Options<T> = {}
): postgres.Options<typeof POSTGRES_BASE_TYPES & T> {
  const { types: userTypes, ...userOptions } = options;
  return {
    types: {
      ...POSTGRES_BASE_TYPES,
      ...userTypes,
    } as typeof POSTGRES_BASE_TYPES & T,
    ...POSTGRES_BASE_OPTIONS,
    ...userOptions,
  };
}

export type Sql<T extends SqlTypes = typeof POSTGRES_BASE_TYPES> = ReturnType<
  typeof postgres<T>
>;

export type TransactionSql<T extends SqlTypes = typeof POSTGRES_BASE_TYPES> =
  Parameters<Parameters<Sql<T>["begin"]>[1]>[0];

export type SqlQuery<T extends readonly postgres.MaybeRow[] = postgres.Row[]> =
  postgres.PendingQuery<T>;

export const POSTGRES_OPTIONS = options({
  max: DATABASE_MAX_CONNECTIONS,
});

// https://github.com/vercel/next.js/issues/7811
// TODO: Export this to a new module, because the issue
// happens regularly with next.js in development mode.
function service<T>(name: string, init: () => T): T {
  if (process.env.NODE_ENV === "development") {
    const globalRecord = global as Record<string, unknown>;
    if (!(name in globalRecord)) globalRecord[name] = init();
    return globalRecord[name] as T;
  }
  return init();
}

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
      })
);

// TODO: Find a more centralized place
prexit(async (signal, error, idk) => {
  console.warn("$ EXIT:", signal, error, idk);
  await Promise.all([
    db.end({ timeout: 5 }),
    dbLegacy?.end({ timeout: 5 }),
    redis.quit(),
  ]);
});

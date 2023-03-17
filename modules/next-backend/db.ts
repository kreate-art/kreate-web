// TODO: Duplicated of kreate-index/src/db.ts
import postgres from "postgres";

import { fromJson, toJson } from "../json-utils";

export { postgres };

export type SqlTypes = Record<string, postgres.PostgresType>;

const POSTGRES_BASE_OPTIONS: postgres.Options<never> = {
  connection: {
    application_name: "kreate/web",
  },
  // eslint-disable-next-line import/no-named-as-default-member
  transform: postgres.camel,
  onnotice: (notice) => {
    console.warn(notice);
  },
  onparameter: (key, value) => {
    console.warn(`(:) ${key} = ${value}`);
  },
  // onclose: (id) => {
  //   console.info(`(.) Connection Closed :: ${id}`);
  // },
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

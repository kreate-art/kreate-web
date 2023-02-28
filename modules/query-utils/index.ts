import { assert } from "@/modules/common-utils";

export type QueryValue = string | string[] | undefined;

export function toBoolean(value: QueryValue): boolean | undefined {
  if (value == null) {
    return undefined;
  } else if (typeof value === "string") {
    assert(["false", "true"].includes(value), "invalid boolean");
    return Boolean(value);
  } else {
    assert(false, "invalid boolean");
  }
}

export function toEnum<T>(value: QueryValue, enumValues: T[]): T | undefined {
  if (value == null) {
    return undefined;
  }
  for (const item of enumValues) {
    if (item === value) return item;
  }
  assert(false, "invalid enum");
}

export function toString(value: QueryValue): string | undefined {
  if (value == null) {
    return undefined;
  } else if (typeof value === "string") {
    return value;
  } else {
    assert(false, "invalid string");
  }
}

export function toInteger(value: QueryValue): number | undefined {
  if (value == null) {
    return undefined;
  } else if (typeof value === "string") {
    assert(/^[0-9]+$/.test(value), "invalid integer");
    return Number(value);
  } else {
    assert(false, "invalid integer");
  }
}

export type Query = Record<string, QueryValue>;

export function toURLSearchParams(query: Query): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") {
      search.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
    }
  }
  return search;
}

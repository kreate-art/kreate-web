import { Parser } from "../types";

import { assert } from "@/modules/common-utils";

export function parseStringByRegex(pattern: RegExp): Parser<string> {
  return (text: string) => {
    assert(pattern.test(text));
    return text;
  };
}

export function parseBaseUrl(): Parser<string> {
  return parseStringByRegex(/^(http|https):\/\/.*[^/]$/);
}

export function parseSlug(): Parser<string> {
  return parseStringByRegex(/^[0-9A-Za-z_-]+$/);
}

export function parseEnum<T>(values: T[]): Parser<T> {
  return (text) => {
    const value = values.find((value) => value === text);
    assert(value !== undefined);
    return value;
  };
}

// https://yaml.org/type/bool.html
export function parseBoolean(): Parser<boolean> {
  return (text) => {
    if (["y", "yes", "true", "on"].includes(text.toLowerCase())) {
      return true;
    }
    if (["n", "no", "false", "off"].includes(text.toLowerCase())) {
      return false;
    }
    assert(false);
  };
}

export function parseHex(): Parser<string> {
  return parseStringByRegex(/^([0-9A-Fa-f]{2})+$/);
}

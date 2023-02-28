// TODO: A duplication of teiki-web/modules/json-utils/index.ts
import JsonBigFactory from "@shinka-network/json-bigint";
import stableStringify from "safe-stable-stringify";

const JsonBig = JsonBigFactory({ useNativeBigInt: true });

export default JsonBig;

/**
 * Converts a JSON-formatted string to a JS value.
 *
 * Big integers will be parsed as `bigint` values.
 * This function is the bigint-aware alternative of `JSON.parse`.
 */
export function fromJson<T = unknown>(text: string): T {
  return JsonBig.parse(text);
}

type ValidJsonTypes = string | number | bigint | boolean | object | unknown[];
type InvalidJsonTypes = undefined | symbol | ((...args: unknown[]) => unknown);

/**
 * Converts a JS value to a JSON-formatted string.
 *
 * Values of `bigint` will be stringified properly.
 * This function is the bigint-aware alternative of `JSON.stringify`.
 */
export function toJson(
  value: InvalidJsonTypes,
  replacer?: Replacer,
  space?: string | number
): undefined;
export function toJson(
  value: ValidJsonTypes,
  replacer?: Replacer,
  space?: string | number
): string;
export function toJson(
  value: unknown,
  replacer?: Replacer,
  space?: string | number
): string | undefined;
export function toJson(
  value: unknown,
  replacer?: Replacer,
  space?: string | number
): string | undefined {
  return JsonBig.stringify(value, replacer, space);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Replacer = (this: any, key: string, value: any) => any;

/**
 * Converts a JS value to a stable JSON-formatted string.
 *
 * Values of `bigint` will be stringified properly.
 * JSON keys are stringified in a stable manner.
 * This function is the safe & stable alternative of `JSON.stringify`.
 */
export function toJsonStable(
  value: InvalidJsonTypes,
  replacer?: SafeReplacer,
  space?: string | number
): undefined;
export function toJsonStable(
  value: ValidJsonTypes,
  replacer?: SafeReplacer,
  space?: string | number
): string;
export function toJsonStable(
  value: unknown,
  replacer?: SafeReplacer,
  space?: string | number
): string | undefined;
export function toJsonStable(
  value: unknown,
  replacer?: SafeReplacer,
  space?: string | number
): string | undefined {
  return stableStringify(value, replacer, space);
}
type SafeReplacer =
  | (number | string)[]
  | null
  | undefined
  | ((key: string, value: unknown) => ValidJsonTypes);

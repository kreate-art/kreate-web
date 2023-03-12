import { Parser } from "../types";

type SupportedTypes =
  | undefined
  | null
  | boolean
  | number
  | string
  | SupportedTypes[]
  | { [key: string]: SupportedTypes };

export function parseEnv<T extends SupportedTypes>({
  label,
  value,
  parser,
}: {
  label: string;
  value: string | undefined;
  parser: Parser<T>;
}): T {
  if (!value) {
    throw new TypeError("Missing env: " + JSON.stringify({ label, value }));
  }
  try {
    return parser(value);
  } catch (error) {
    throw new RangeError(
      "Failed to parse env: " + JSON.stringify({ label, value }),
      { cause: error }
    );
  }
}

export function parseEnv$Optional<T extends SupportedTypes>({
  label,
  value,
  parser,
  defaultValue,
}: {
  label: string;
  value: string | undefined;
  parser: Parser<T>;
  defaultValue: T;
}) {
  if (!value) {
    return defaultValue;
  }
  try {
    return parser(value);
  } catch (error) {
    throw new RangeError(
      "Failed to parse env: " + JSON.stringify({ label, value }),
      { cause: error }
    );
  }
}

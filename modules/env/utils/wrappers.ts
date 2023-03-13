import { Parser } from "../types";

// anything except functions
type SupportedTypes =
  | undefined
  | null
  | boolean
  | number
  | string
  | unknown[]
  | { [key: string]: unknown }
  | Map<unknown, unknown>;

export function parseEnv<T extends SupportedTypes>({
  label,
  input,
  parser,
}: {
  label: string;
  input: string | undefined;
  parser: Parser<T>;
}): T {
  if (!input) {
    throw new Error("Missing env: " + JSON.stringify({ label, input }));
  }
  try {
    return parser(input);
  } catch (error) {
    throw new Error(
      "Failed to parse env: " + JSON.stringify({ label, input }),
      { cause: error }
    );
  }
}

export function parseEnv$Optional<T extends SupportedTypes>({
  label,
  input,
  parser,
  defaultValue,
}: {
  label: string;
  input: string | undefined;
  parser: Parser<T>;
  defaultValue: T;
}) {
  if (!input) {
    return defaultValue;
  }
  try {
    return parser(input);
  } catch (error) {
    throw new Error(
      "Failed to parse env: " + JSON.stringify({ label, input }),
      { cause: error }
    );
  }
}

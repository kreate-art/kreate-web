import React from "react";

import { toJson } from "@/modules/json-utils";

export class DisplayableError extends Error {
  public readonly title: string;
  public readonly description?: string;
  public readonly cause?: unknown;

  constructor({
    title,
    description,
    cause,
  }: {
    title: string;
    description?: string;
    cause?: unknown;
  }) {
    const message = description ? title + "\n\n" + description : title;
    super(message, { cause });

    this.name = "DisplayableError";
    this.title = title;
    this.description = description;
    this.cause = cause;

    console.groupCollapsed(
      `[DisplayableError][${Date.now()}] ${
        title.length <= 16 ? title : title.slice(0, 16) + "..."
      }`
    );
    writeErrorToConsole(this);
    console.groupEnd();
  }

  static from(error: unknown, defaultTitle = "Error") {
    if (error instanceof DisplayableError) {
      return error;
    } else if (error instanceof Error) {
      return new DisplayableError({
        title: defaultTitle,
        description: error.message ? '"' + error.message + '"' : undefined,
        cause: error,
      });
    } else {
      return new DisplayableError({
        title: defaultTitle,
        cause: error,
      });
    }
  }

  static assert(
    condition: unknown,
    params: string | { title: string; description?: string; cause?: unknown }
  ): asserts condition {
    if (condition) return;
    throw new DisplayableError(
      typeof params === "string" ? { title: params } : params
    );
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return (
      `[Error: ${error.name || "unknown"}]` +
      "\n\n" +
      error.message +
      "\n\n" +
      error.stack
    );
  } else {
    return toJson(error, undefined, 2) ?? "[Error]";
  }
}

export function getCauses(error: unknown): unknown[] {
  const hasCause = error instanceof Error && error.cause;
  if (!hasCause) return [];
  return [error.cause, ...getCauses(error.cause)];
}

export function writeErrorToConsole(error: unknown) {
  console.error(error);
  getCauses(error).forEach((cause) => {
    console.groupCollapsed("Caused by:");
    console.error(
      typeof cause === "object" && Object.getPrototypeOf(cause) == null
        ? Object.assign({}, cause)
        : cause
    );
    console.groupEnd();
  });
}

/**
 * `const displayableError = useDisplayableError(error)`
 *
 * is similar to
 *
 * `const displayableError = error != null ? DisplayableError.from(error) : undefined`.
 *
 * However, `useDisplayableError` prevent an error from being printed multiple
 * times by using `React.useMemo`.
 */
export function useDisplayableError(
  error: unknown,
  defaultTitle = "Error"
): DisplayableError | undefined {
  return React.useMemo(() => {
    if (error == null) return undefined;
    return DisplayableError.from(error, defaultTitle);
  }, [error, defaultTitle]);
}

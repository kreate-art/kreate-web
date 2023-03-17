import React from "react";

import { parseLovelaceAmount } from "@/modules/bigint-utils";

export function useField$RequiredStake({ initial }: { initial: string }) {
  const [text, setText] = React.useState(initial);
  const parsed = parseLovelaceAmount(text);
  const error = parsed == null ? "Invalid number" : undefined;

  const normalize = (text: string) => text.replace(/[^0-9.]+/g, "");

  // TODO: @sk-kitsune: we should also set onKeyDown at the call site
  const handleTextChange = (text: string) => {
    setText(normalize(text));
  };
  return { text, setText: handleTextChange, normalize, parsed, error };
}

export function useField$MaximumMembers({ initial }: { initial: string }) {
  const [text, setText] = React.useState(initial);
  const parsed = Number(text);
  const error = Number.isNaN(parsed) ? "Invalid number" : undefined;

  const normalize = (text: string) => text.replace(/[^0-9.]+/g, "");

  // TODO: @sk-kitsune: we should also set onKeyDown at the call site
  const handleTextChange = (text: string) => {
    setText(normalize(text));
  };
  return { text, setText: handleTextChange, normalize, parsed, error };
}

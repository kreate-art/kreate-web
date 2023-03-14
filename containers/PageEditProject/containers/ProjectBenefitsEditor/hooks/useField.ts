import React from "react";

import { parseLovelaceAmount } from "@/modules/bigint-utils";

export function useField$RequiredStake({ initial }: { initial: string }) {
  const [text, setText] = React.useState(initial);
  const parsed = parseLovelaceAmount(text);
  const error = parsed == null ? "Invalid number" : undefined;

  // TODO: @sk-kitsune: we should also set onKeyDown at the call site
  const handleTextChange = (text: string) => {
    setText(text.replace(/[^0-9.]+/g, ""));
  };
  return { text, setText: handleTextChange, parsed, error };
}

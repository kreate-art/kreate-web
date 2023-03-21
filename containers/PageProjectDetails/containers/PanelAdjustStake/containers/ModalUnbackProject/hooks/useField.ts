import * as React from "react";

import {
  formatLovelaceAmount,
  parseLovelaceAmount,
  sumLovelaceAmount,
} from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";

export function useField$Message() {
  const [text, setText] = React.useState("");
  const message$Error =
    text.length > 1500 ? "Exceed character limit" : undefined;
  return {
    text,
    setText,
    parsed: !message$Error ? text : undefined,
    error: message$Error,
  };
}

export function useField$UnbackLovelaceAmount({
  initialAmount,
  max,
}: {
  initialAmount?: LovelaceAmount;
  max?: LovelaceAmount;
}) {
  const [text, setText] = React.useState(
    initialAmount != null
      ? formatLovelaceAmount(initialAmount, {
          compact: false,
          excludeThousandsSeparator: true,
        })
      : ""
  );
  const parsed = parseLovelaceAmount(text);
  const error =
    parsed == null || parsed === BigInt(0)
      ? "Invalid amount"
      : max != null && parsed > BigInt(max)
      ? "Amount too big"
      : max != null &&
        parsed !== BigInt(max) &&
        max < sumLovelaceAmount([parsed, 2000000])
      ? /**
         * NOTE: @sk-tenba: the user has to either withdraw all the backing or
         * maintain the backing amount to be at least 2 ada for the min ada requirement
         * TODO: @sk-tenba: import min-ada-amount from somewhere
         */
        "You must withdraw all or leave at least 2 ADA behind"
      : null;
  const onTextChange = (value: string) => {
    setText(value.replace(/[^0-9.]+/g, ""));
  };
  return { text, onTextChange, parsed: !error ? parsed : undefined, error };
}

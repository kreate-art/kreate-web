import React from "react";

import { MINIMUM_BACKING_AMOUNT } from "../constants";

import {
  formatLovelaceAmount,
  parseLovelaceAmount,
} from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";

export function useField$Message() {
  const [text, setText] = React.useState("");
  const error = text.length > 1500 ? "Exceed character limit" : undefined;
  const parsed = !error ? text : undefined;
  return { text, setText, error, parsed };
}

export function useField$LovelaceAmount({
  initialAmount,
  maxLovelaceAmount,
}: {
  initialAmount?: LovelaceAmount;
  maxLovelaceAmount: LovelaceAmount | undefined;
}) {
  const [text, setText] = React.useState(
    initialAmount != null
      ? formatLovelaceAmount(initialAmount, { compact: false })
      : ""
  );
  const parsed = parseLovelaceAmount(text);
  const error =
    parsed == null
      ? "Invalid number"
      : maxLovelaceAmount != null && maxLovelaceAmount < MINIMUM_BACKING_AMOUNT
      ? "Insufficient ADA balance"
      : parsed < MINIMUM_BACKING_AMOUNT
      ? "You must back at least 2 ADA"
      : maxLovelaceAmount != null && maxLovelaceAmount < parsed
      ? `You can only stake up to ${formatLovelaceAmount(
          maxLovelaceAmount
        )} ₳. The remaining ₳ is required to hold other native tokens in your wallet`
      : undefined;

  // TODO: @sk-kitsune: we should also set onKeyDown at the call site
  const handleTextChange = (text: string) => {
    setText(text.replace(/[^0-9.]+/g, ""));
  };
  return { text, setText: handleTextChange, parsed, error };
}

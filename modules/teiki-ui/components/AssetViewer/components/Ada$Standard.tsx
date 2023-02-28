import {
  EN_DASH,
  NON_BREAKING_SPACE,
  ADA_SYMBOL,
  ALMOST_EQUAL_TO,
} from "../constants";
import { ForwardedProps } from "../types";

import { LovelaceAmount } from "@/modules/business-types";
import Typography from "@/modules/teiki-ui/components/Typography";

const numberFormat$Default = new Intl.NumberFormat("en-US", {
  notation: "standard",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormat$MaxPrecision = new Intl.NumberFormat("en-US", {
  notation: "standard",
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

export function Ada$Standard({
  as,
  lovelaceAmount,
  approx = false,
  ...others
}: {
  as: "div" | "span";
  lovelaceAmount: LovelaceAmount | undefined;
  approx?: boolean;
} & ForwardedProps) {
  const Component = as === "span" ? Typography.Span : Typography.Div;

  if (lovelaceAmount == null) {
    return <Component {...others}>{EN_DASH}</Component>;
  }

  const title = `${lovelaceAmount} lovelaces`;

  const numberFormat =
    lovelaceAmount > 0 && lovelaceAmount < 5000
      ? numberFormat$MaxPrecision
      : numberFormat$Default;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#using_format_with_a_string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infix = numberFormat.format(`${lovelaceAmount}E-6` as any);
  const prefix = approx ? ALMOST_EQUAL_TO + NON_BREAKING_SPACE : "";
  const suffix = NON_BREAKING_SPACE + ADA_SYMBOL;

  return (
    <Component title={title} {...others}>
      {prefix + infix + suffix}
    </Component>
  );
}

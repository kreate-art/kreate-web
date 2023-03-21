import {
  EN_DASH,
  NON_BREAKING_SPACE,
  ADA_SYMBOL,
  ALMOST_EQUAL_TO,
} from "../constants";
import { ForwardedProps } from "../types";

import { LovelaceAmount } from "@/modules/business-types";
import Typography from "@/modules/teiki-ui/components/Typography";

const numberFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function Ada$Compact({
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

  if (lovelaceAmount > 0 && lovelaceAmount < 5000) {
    // less than 0.005 ADA
    return (
      <Component title={title} {...others}>
        {"<" + "0.01" + NON_BREAKING_SPACE + ADA_SYMBOL}
      </Component>
    );
  }

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

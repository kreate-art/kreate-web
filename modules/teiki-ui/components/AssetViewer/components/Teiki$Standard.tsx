import {
  EN_DASH,
  NON_BREAKING_SPACE,
  ALMOST_EQUAL_TO,
  TEIKI_SYMBOL,
} from "../constants";
import { ForwardedProps } from "../types";

import { MicroTeikiAmount } from "@/modules/business-types";
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

export function Teiki$Standard({
  as,
  microTeikiAmount,
  approx = false,
  ...others
}: {
  as: "div" | "span";
  microTeikiAmount: MicroTeikiAmount | undefined;
  approx?: boolean;
} & ForwardedProps) {
  const Component = as === "span" ? Typography.Span : Typography.Div;

  if (microTeikiAmount == null) {
    return <Component {...others}>{EN_DASH}</Component>;
  }

  const title = `${microTeikiAmount} microteikis`;

  const numberFormat =
    microTeikiAmount > 0 && microTeikiAmount < 5000
      ? numberFormat$MaxPrecision
      : numberFormat$Default;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#using_format_with_a_string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infix = numberFormat.format(`${microTeikiAmount}E-6` as any);
  const prefix = approx ? ALMOST_EQUAL_TO + NON_BREAKING_SPACE : "";
  const suffix = NON_BREAKING_SPACE + TEIKI_SYMBOL;

  return (
    <Component title={title} {...others}>
      {prefix + infix + suffix}
    </Component>
  );
}

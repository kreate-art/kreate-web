import { ALMOST_EQUAL_TO, EN_DASH, NON_BREAKING_SPACE } from "../constants";
import { ForwardedProps } from "../types";

import { LovelaceAmount } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  as: "div" | "span";
  lovelaceAmount: LovelaceAmount | undefined;
  approx?: boolean;
} & ForwardedProps;

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

export function Usd$FromAda({
  as,
  lovelaceAmount,
  approx = true,
  ...others
}: Props) {
  const { adaPriceInfo } = useAppContextValue$Consumer();
  const Component = as === "span" ? Typography.Span : Typography.Div;

  const usdAmount =
    adaPriceInfo && lovelaceAmount != null
      ? adaPriceInfo.usd * Number(lovelaceAmount) * 1e-6
      : undefined;

  if (usdAmount == null) {
    return <Component {...others}>{EN_DASH}</Component>;
  }

  const title = `${usdAmount} USD`;
  const numberFormat =
    usdAmount > 0 && usdAmount < 0.005
      ? numberFormat$MaxPrecision
      : numberFormat$Default;
  const infix = numberFormat.format(usdAmount);
  const prefix = approx ? ALMOST_EQUAL_TO + NON_BREAKING_SPACE : "";
  const suffix = NON_BREAKING_SPACE + "USD";

  return (
    <Component title={title} {...others}>
      {prefix + infix + suffix}
    </Component>
  );
}

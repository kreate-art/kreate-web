import {
  ALMOST_EQUAL_TO,
  EN_DASH,
  NON_BREAKING_SPACE,
  USD_SYMBOL,
} from "../constants";
import { ForwardedProps } from "../types";

import { LovelaceAmount } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  as: "div" | "span";
  lovelaceAmount: LovelaceAmount | undefined | null;
  approx?: boolean;
} & ForwardedProps;

const numberFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
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

  const title = `${usdAmount} ${USD_SYMBOL}`;
  if (usdAmount > 0 && usdAmount < 0.01) {
    return (
      <Component title={title} {...others}>
        {"<" + USD_SYMBOL + "0.01"}
      </Component>
    );
  }
  const suffix = numberFormat.format(usdAmount);
  const prefix =
    (approx ? ALMOST_EQUAL_TO + NON_BREAKING_SPACE : "") + USD_SYMBOL;

  return (
    <Component title={title} {...others}>
      {prefix + suffix}
    </Component>
  );
}

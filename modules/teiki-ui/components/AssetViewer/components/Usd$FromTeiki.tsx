import { EN_DASH } from "../constants";
import { ForwardedProps } from "../types";

import { MicroTeikiAmount } from "@/modules/business-types";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  as: "div" | "span";
  microTeikiAmount: MicroTeikiAmount | undefined;
  approx?: boolean;
} & ForwardedProps;

// NOTE: @sk-kitsune: currently, we don't have Teiki price yet
export function Usd$FromTeiki({ as, ...others }: Props) {
  const Component = as === "span" ? Typography.Span : Typography.Div;
  return <Component {...others}>{EN_DASH}</Component>;
}

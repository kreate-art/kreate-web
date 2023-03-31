import cx from "classnames";
import useSWR from "swr";

import { ForwardedProps } from "../AssetViewer/types";
import Typography from "../Typography";

import styles from "./index.module.scss";

import { getAdaHandle } from "@/modules/ada-handle/utils";

type Length = "short" | "medium" | "long" | "full";
const LENGTH_TO_PREFIX_LENGTH: Record<Length, number> = {
  short: 5,
  medium: 10,
  long: 20,
  full: Infinity,
};
const LENGTH_TO_SUFFIX_LENGTH: Record<Length, number> = {
  short: 3,
  medium: 10,
  long: 20,
  full: Infinity,
};

type Props = {
  value: string;
  as?: "span" | "div";
  length?: Length;
  className?: string;
  style?: React.CSSProperties;
} & ForwardedProps;

/**NOTE: @sk-tenba: should handle the max width carefully */
export default function AddressViewer({
  className,
  style,
  value,
  as = "div",
  length = "short",
  ...others
}: Props) {
  const Component = as == "span" ? Typography.Span : Typography.Div;
  const { data: handle, error } = useSWR(
    ["c2b75c1b-8c7a-4124-ac76-909b2a943a4f", value],
    async () => {
      return await getAdaHandle(value);
    }
  );
  const hasAdaHandle = handle && handle !== value && error == null;
  if (hasAdaHandle) {
    return (
      <Component
        className={cx(className, styles.overflowHandle)}
        style={style}
        {...others}
      >
        {handle}
      </Component>
    );
  }
  const prefixLength = LENGTH_TO_PREFIX_LENGTH[length];
  const suffixLength = LENGTH_TO_SUFFIX_LENGTH[length];
  const displayedText =
    prefixLength + suffixLength >= value.length
      ? value
      : value.slice(0, prefixLength) + "..." + value.slice(-suffixLength);
  return (
    <Component className={className} style={style} {...others}>
      {displayedText}
    </Component>
  );
}

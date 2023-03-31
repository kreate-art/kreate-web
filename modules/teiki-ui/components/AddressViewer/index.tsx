import cx from "classnames";
import useSWR from "swr";

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
};

/**NOTE: @sk-tenba: should handle the max width carefully */
export default function AddressViewer({
  className,
  style,
  value,
  as = "div",
  length = "short",
}: Props) {
  const { data: handle, error } = useSWR(
    ["c2b75c1b-8c7a-4124-ac76-909b2a943a4f", value],
    async () => {
      return await getAdaHandle(value);
    }
  );
  const hasAdaHandle = handle && handle !== value && error == null;
  if (hasAdaHandle) {
    if (as === "div") {
      return (
        <div className={cx(className, styles.overflowHandle)} style={style}>
          {handle}
        </div>
      );
    }
    return (
      <span className={className} style={style}>
        {handle}
      </span>
    );
  }
  const prefixLength = LENGTH_TO_PREFIX_LENGTH[length];
  const suffixLength = LENGTH_TO_SUFFIX_LENGTH[length];
  const displayedText =
    prefixLength + suffixLength >= value.length
      ? value
      : value.slice(0, prefixLength) + "..." + value.slice(-suffixLength);
  return as === "div" ? (
    <div className={className} style={style}>
      {displayedText}
    </div>
  ) : (
    <span className={className} style={style}>
      {displayedText}
    </span>
  );
}

import cx from "classnames";
import * as React from "react";
import useSWR from "swr";

import styles from "./index.module.scss";

import { getAdaHandle } from "@/modules/ada-handle/utils";
import { Address } from "@/modules/business-types";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Address;
};

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
function Base({
  className,
  style,
  value,
  length = "short",
}: Props & { length: "short" | "medium" | "long" | "full" }) {
  const { data: handle, error } = useSWR(
    ["c2b75c1b-8c7a-4124-ac76-909b2a943a4f", value],
    async () => {
      return await getAdaHandle(value);
    }
  );
  const prefixLength = LENGTH_TO_PREFIX_LENGTH[length];
  const suffixLength = LENGTH_TO_SUFFIX_LENGTH[length];
  const hasAdaHandle = handle && handle !== value && error == null;
  if (hasAdaHandle) {
    return (
      <div className={className} style={style}>
        <div className={styles.handle}>
          <span>{handle}</span>
        </div>
      </div>
    );
  }
  const displayedText =
    prefixLength + suffixLength >= value.length
      ? value
      : value.slice(0, prefixLength) + "..." + value.slice(-suffixLength);
  return (
    <span
      title={hasAdaHandle ? handle : value}
      className={cx(styles.baseContainer, className)}
      style={style}
    >
      {displayedText}
    </span>
  );
}

/**
 * Note: @sk-tenba: InlineAddress.Auto should be used with a specified width
 */
function Auto({ className, style, value }: Props) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(container);
  return (
    <div
      className={cx(className, styles.autoContainer)}
      style={style}
      ref={setContainer}
    >
      {containerSize == null ? null : containerSize.w <= 208 ? (
        <Base value={value} length={"short"} />
      ) : containerSize.w <= 460 ? (
        <Base value={value} length={"medium"} />
      ) : containerSize.w <= 1250 ? (
        <Base value={value} length={"long"} />
      ) : (
        <Base value={value} length={"full"} />
      )}
    </div>
  );
}

const InlineAddress = Object.assign(Base, { Auto });

export default InlineAddress;

import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { Address } from "@/modules/business-types";
import useAdaHandle from "@/modules/common-hooks/hooks/useAdaHandle";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Address;
  allowAdaHandle: boolean;
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
  allowAdaHandle,
}: Props & { length: "short" | "medium" | "long" | "full" }) {
  const { data, error } = useAdaHandle(value);
  const prefixLength = LENGTH_TO_PREFIX_LENGTH[length];
  const suffixLength = LENGTH_TO_SUFFIX_LENGTH[length];
  const displayedText =
    prefixLength + suffixLength >= value.length
      ? value
      : value.slice(0, prefixLength) + "..." + value.slice(-suffixLength);
  return (
    <span
      title={value}
      className={cx(styles.baseContainer, className)}
      style={style}
    >
      {allowAdaHandle && error == null && data ? `$${data}` : displayedText}
    </span>
  );
}

/**
 * Note: @sk-tenba: InlineAddress.Auto should be used with a specified width
 */
function Auto({ className, style, value, allowAdaHandle }: Props) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(container);
  return (
    <div
      className={cx(className, styles.autoContainer)}
      style={style}
      ref={setContainer}
    >
      {containerSize == null ? null : containerSize.w <= 208 ? (
        <Base value={value} length={"short"} allowAdaHandle={allowAdaHandle} />
      ) : containerSize.w <= 460 ? (
        <Base value={value} length={"medium"} allowAdaHandle={allowAdaHandle} />
      ) : containerSize.w <= 1250 ? (
        <Base value={value} length={"long"} allowAdaHandle={allowAdaHandle} />
      ) : (
        <Base value={value} length={"full"} allowAdaHandle={allowAdaHandle} />
      )}
    </div>
  );
}

const InlineAddress = Object.assign(Base, { Auto });

export default InlineAddress;

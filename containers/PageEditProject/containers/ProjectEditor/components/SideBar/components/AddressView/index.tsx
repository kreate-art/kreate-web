import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { Address } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Address;
};

export default function AddressView({ className, style, value }: Props) {
  const prefix = value.slice(0, 4);
  const suffix = value.slice(4).slice(-3); // defensivie coding, just in case that value.length < 7
  return (
    <span className={cx(styles.container, className)} style={style}>
      {prefix + "..." + suffix}
    </span>
  );
}

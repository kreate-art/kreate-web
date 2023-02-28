import cx from "classnames";
import * as React from "react";

import Divider from "../../../Divider";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function Actions({ className, style, children }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Divider.Horizontal />
      <div className={styles.buttons}>{children}</div>
    </div>
  );
}

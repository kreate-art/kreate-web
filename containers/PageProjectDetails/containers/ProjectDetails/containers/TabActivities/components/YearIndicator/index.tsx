import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
};

export default function YearIndicator({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <hr className={styles.divider}></hr>
      <div className={styles.box}>{value}</div>
    </div>
  );
}

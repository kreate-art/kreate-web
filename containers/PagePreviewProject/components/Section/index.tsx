import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * @experimental
 *
 * Limits max-width to be 1440px.
 */
export default function Section({
  className,
  style,
  content,
  children = content,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

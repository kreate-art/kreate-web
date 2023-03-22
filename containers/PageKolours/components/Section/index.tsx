import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  marginTop?: React.CSSProperties["marginTop"];
  marginBottom?: React.CSSProperties["marginBottom"];
};

export default function Section({
  className,
  style,
  children,
  marginTop,
  marginBottom,
}: Props) {
  return (
    <div
      className={cx(styles.container, className)}
      style={{ marginTop, marginBottom, ...style }}
    >
      {children}
    </div>
  );
}

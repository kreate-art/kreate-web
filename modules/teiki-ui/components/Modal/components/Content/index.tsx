import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  padding?: "default" | "none";
};

export default function Content({
  className,
  style,
  content,
  children,
  padding = "default",
}: Props) {
  const actualChildren = children || content;
  return (
    <div
      className={cx(
        styles.container,
        className,
        padding === "default" ? styles.paddingDefault : null
      )}
      style={style}
    >
      {actualChildren}
    </div>
  );
}

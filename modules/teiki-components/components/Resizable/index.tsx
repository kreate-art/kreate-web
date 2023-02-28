import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  defaultWidth?: string;
  canResizeHeight?: boolean;
};

export default function Resizable({
  className,
  style,
  children,
  defaultWidth,
  canResizeHeight,
}: Props) {
  return (
    <div
      className={cx(styles.container, className)}
      style={{
        width: defaultWidth,
        resize: canResizeHeight ? "both" : "horizontal",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

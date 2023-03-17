import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  defaultWidth?: string;
  canResizeHeight?: boolean;
  canResizeWidth?: boolean;
};

export default function Resizable({
  className,
  style,
  children,
  defaultWidth,
  canResizeHeight,
  canResizeWidth,
}: Props) {
  return (
    <div
      className={cx(styles.container, className)}
      style={{
        width: defaultWidth,
        resize:
          canResizeHeight && canResizeWidth
            ? "both"
            : canResizeHeight
            ? "vertical"
            : canResizeWidth
            ? "horizontal"
            : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  topSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  error?: boolean;
};

/**
 * Wrapper of `<input>` and `<textarea>` elements.
 * Supports multiple slots: top, left, bottom, right, content.
 */
export default function InputShell({
  className,
  style,
  content,
  children = content,
  topSlot,
  leftSlot,
  bottomSlot,
  rightSlot,
  error,
}: Props) {
  return (
    <div
      className={cx(styles.container, className, error ? styles.error : null)}
      style={style}
    >
      {topSlot ? (
        <div className={cx(styles.slot, styles.topSlot)}>{topSlot}</div>
      ) : null}
      {leftSlot ? (
        <div className={cx(styles.slot, styles.leftSlot)}>{leftSlot}</div>
      ) : null}
      {children ? (
        <div className={cx(styles.slot, styles.centerSlot)}>{children}</div>
      ) : null}
      {rightSlot ? (
        <div className={cx(styles.slot, styles.rightSlot)}>{rightSlot}</div>
      ) : null}
      {bottomSlot ? (
        <div className={cx(styles.slot, styles.bottomSlot)}>{bottomSlot}</div>
      ) : null}
    </div>
  );
}

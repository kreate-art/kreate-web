import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function Chip({
  className,
  style,
  content,
  children,
  title,
  ...others
}: Props) {
  const displayedContent = children || content;
  return (
    <span
      className={cx(styles.container, className)}
      style={style}
      title={
        title ||
        (typeof displayedContent === "string" ? displayedContent : undefined)
      }
      {...others}
    >
      {displayedContent}
    </span>
  );
}

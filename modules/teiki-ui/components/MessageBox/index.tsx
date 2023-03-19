import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

const COLOR_TO_CLASS_NAME = {
  info: styles.colorInfo,
  success: styles.colorSuccess,
  danger: styles.colorDanger,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  description?: string;
  color?: keyof typeof COLOR_TO_CLASS_NAME;
};

export default function MessageBox({
  className,
  style,
  title,
  description,
  color = "info",
}: Props) {
  return (
    <div
      className={cx(styles.container, className, COLOR_TO_CLASS_NAME[color])}
      style={style}
    >
      {title ? <div className={styles.title}>{title}</div> : null}
      {description ? (
        <div className={styles.description}>{description}</div>
      ) : null}
    </div>
  );
}

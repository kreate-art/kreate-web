import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  description?: string;
};

export default function InfoBox({
  className,
  style,
  title,
  description,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {description ? (
        <div className={styles.description}>{description}</div>
      ) : null}
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type CommonProps =
  | {
      className?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
    }
  | React.HTMLAttributes<HTMLDivElement>;

function Container({ className, style, children, ...others }: CommonProps) {
  return (
    <div className={cx(styles.container, className)} style={style} {...others}>
      {children}
    </div>
  );
}

function Content({ className, style, children, ...others }: CommonProps) {
  return (
    <div className={cx(styles.content, className)} style={style} {...others}>
      {children}
    </div>
  );
}

function Legend({ className, style, children, ...others }: CommonProps) {
  return (
    <div className={cx(styles.legend, className)} style={style} {...others}>
      {children}
    </div>
  );
}

const Card = Object.assign(Container, { Content, Legend });

export default Card;

import cx from "classnames";
import * as React from "react";

import { Message } from "../../types";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Message;
};

export default function MessageView({ className, style, value }: Props) {
  switch (value.type) {
    case "string":
      return (
        <div className={cx(styles.container, className)} style={style}>
          {value.body}
        </div>
      );
    case "node":
      return (
        <div className={cx(styles.container, className)} style={style}>
          {value.body}
        </div>
      );
  }
}

import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

// Feel free to add more colors
const COLOR_TO_CLASS_NAME = {
  ink50: styles.colorInk50,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  color?: keyof typeof COLOR_TO_CLASS_NAME;
};

export default function Divider$Horizontal$CustomDash({
  className,
  style,
  color = "ink50",
}: Props) {
  return (
    <div
      className={cx(styles.container, className, COLOR_TO_CLASS_NAME[color])}
      style={style}
    >
      <svg width="100%" height="100%" fill="none">
        <line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="currentColor"
          strokeOpacity="100%"
          strokeDasharray="1 4" // 1 dot, 4 spaces, i.e. #____#____#____
        />
      </svg>
    </div>
  );
}

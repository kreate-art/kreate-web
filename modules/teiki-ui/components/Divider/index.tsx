import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

const COLOR_TO_CLASSNAME = {
  "white-10": styles.colorWhite10,
  "white-05": styles.colorWhite05,
  "black-10": styles.colorBlack10,
  "black-05": styles.colorBlack05,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  color?: keyof typeof COLOR_TO_CLASSNAME;
};

function Horizontal({ className, style, color = "black-10" }: Props) {
  return (
    <hr
      className={cx(
        styles.divider,
        styles.horizontal,
        className,
        COLOR_TO_CLASSNAME[color]
      )}
      style={style}
    ></hr>
  );
}

function Vertical({ className, style, color = "black-10" }: Props) {
  return (
    <hr
      className={cx(
        styles.divider,
        styles.vertical,
        className,
        COLOR_TO_CLASSNAME[color]
      )}
      style={style}
    ></hr>
  );
}

const Divider = { Horizontal, Vertical };

export default Divider;

import cx from "classnames";
import * as React from "react";

import { IconGreenStar } from "../BlogSection/component/Icon/IconGreenStar";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SponsorSlogan({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.slogan}>SPONSORS</div>
      <div className={styles.icon} style={{ verticalAlign: "text-top" }}>
        <IconGreenStar />
      </div>
    </div>
  );
}

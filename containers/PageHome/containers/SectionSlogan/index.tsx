import cx from "classnames";
import Image from "next/image";
import * as React from "react";

import svgKreateWYC from "./assets/kreate-wyc.svg";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionSlogan({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Image
        className={styles.kreateWYC}
        src={svgKreateWYC}
        alt="kreate with your community"
        priority
      />
    </div>
  );
}

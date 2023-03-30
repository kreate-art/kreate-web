import cx from "classnames";
import Link from "next/link";

import styles from "./index.module.scss";

import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function Menu$TopNavigation({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.topNavContainer}>
        <Link href="/gallery" className={styles.link}>
          The Origin of Kolours
        </Link>
        <div className={styles.currentNav}>Your Kolours</div>
      </div>
      <Divider$Horizontal$CustomDash />
    </div>
  );
}

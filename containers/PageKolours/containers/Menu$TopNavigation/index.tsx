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
        <div className={styles.currentNav}>The Origin of Kolours</div>
        <Link href="/mint-by-color-picker" className={styles.link}>
          Your Kolours
        </Link>
      </div>
      <Divider$Horizontal$CustomDash />
    </div>
  );
}

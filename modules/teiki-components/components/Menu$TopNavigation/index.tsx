import cx from "classnames";
import Link from "next/link";

import styles from "./index.module.scss";

import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";

type Item = { label: string; key: string; href: string };

type Props = {
  className?: string;
  style?: React.CSSProperties;
  items: Item[];
  activeKey: string;
};

export default function Menu$TopNavigation({
  className,
  style,
  items,
  activeKey,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.topNavContainer}>
        {items.map((item) =>
          item.key === activeKey ? (
            <div className={styles.currentNav} key={item.key}>
              {item.label}
            </div>
          ) : (
            <Link href={item.href} className={styles.link} key={item.key}>
              {item.label}
            </Link>
          )
        )}
      </div>
      <Divider$Horizontal$CustomDash />
    </div>
  );
}

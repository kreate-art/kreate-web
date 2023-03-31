import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import styles from "./index.module.scss";

import { LogoKreateWhite } from "@/modules/teiki-logos";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function NavBar({ className, style }: Props) {
  return (
    <Flex.Row
      justifyContent="space-between"
      alignItems="center"
      padding="32px 56px"
      flexWrap="wrap"
      className={cx(styles.container, className)}
      style={style}
    >
      <Flex.Row gap="16px" alignItems="center" className={styles.leftColumn}>
        <LogoKreateWhite className={styles.logoKreate} />
        <Divider.Vertical color="white-10" />
        <div className={styles.kolourTypo}>Kolours</div>
      </Flex.Row>
      <Flex.Row className={styles.rightColumn}>
        {/* <Link href="/gallery">
          <div className={styles.buttonNav}>Gallery</div>
        </Link> */}
        {/**NOTE: sk-tenba: using absolute path for more accurate link */}
        <Link href="/#kreataverse">
          <div className={styles.buttonNav}>The Kreataverse</div>
        </Link>
        <Link href="/#how">
          <div className={styles.buttonNav}>How to Kolour</div>
        </Link>
        <Link href="/#rewards">
          <div className={styles.buttonNav}>Your Rewards</div>
        </Link>
        <Link href="/#roadmap">
          <div className={styles.buttonNav}>Roadmap</div>
        </Link>
      </Flex.Row>
    </Flex.Row>
  );
}

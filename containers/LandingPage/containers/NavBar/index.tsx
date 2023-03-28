import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import styles from "./index.module.scss";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { LogoKreateWhite } from "@/modules/teiki-logos";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function NavBar({ className, style }: Props) {
  const [rightColumnContainer, setRightColumnContainer] =
    React.useState<HTMLDivElement | null>(null);

  const size = useElementSize(rightColumnContainer);
  const isSizeSmall = size != null && size.w < 600;
  return (
    <Flex.Row
      justifyContent="space-between"
      alignItems="center"
      padding="32px 56px"
      flexWrap="wrap"
      gap="50px"
      className={cx(styles.container, className)}
      style={style}
    >
      <Flex.Row
        className={styles.leftColumn}
        flex="0 0 auto"
        gap="16px"
        alignItems="center"
        justifyContent="center"
      >
        <LogoKreateWhite className={styles.logoKreate} />
        <Divider.Vertical color="white-10" />
        <div className={styles.kolourTypo}>Kolours</div>
      </Flex.Row>
      <div
        style={
          isSizeSmall
            ? { fontSize: "10px", gap: "24px", justifyContent: "center" }
            : { fontSize: "14px", gap: "48px" }
        }
        className={styles.rightColumn}
        ref={setRightColumnContainer}
      >
        <Link href="/gallery">
          <div className={styles.buttonNav}>Gallery</div>
        </Link>
        <Link href="#story">
          <div className={styles.buttonNav}>Kreataverse Story</div>
        </Link>
        <Link href="/mint">
          <div className={styles.buttonNav}>
            Start Kolouring The Kreataverse
          </div>
        </Link>
        <Link href="#reward">
          <div className={styles.buttonNav}>Your Rewards</div>
        </Link>
        <Link href="#roadmap">
          <div className={styles.buttonNav}>Roadmap</div>
        </Link>
      </div>
    </Flex.Row>
  );
}

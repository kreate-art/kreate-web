import cx from "classnames";
import * as React from "react";

import IconClosed from "./icons/IconClosed";
import IconFeatured from "./icons/IconFeatured";
import IconSponsor from "./icons/IconSponsor";
import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function Featured({ className, style }: Props) {
  return (
    <div
      className={cx(styles.container, styles.containerFeatured, className)}
      style={style}
    >
      <Flex.Row
        padding="12px 16px"
        minHeight="48px"
        gap="12px"
        alignItems="center"
        justifyContent="center"
      >
        <IconFeatured />
        <Typography.Div
          content="Featured Kreator"
          size="heading6"
          color="none"
        />
      </Flex.Row>
    </div>
  );
}

export function Sponsor({ className, style }: Props) {
  return (
    <div
      className={cx(styles.container, styles.containerSponsor, className)}
      style={style}
    >
      <Flex.Row
        padding="12px 16px"
        minHeight="48px"
        gap="12px"
        alignItems="center"
        justifyContent="center"
      >
        <IconSponsor />
        <Typography.Div
          content="Sponsoring Kreate"
          size="heading6"
          color="none"
        />
      </Flex.Row>
    </div>
  );
}

export function Closed({ className, style }: Props) {
  return (
    <div
      className={cx(styles.container, styles.containerClosed, className)}
      style={style}
    >
      <Flex.Row
        padding="12px 16px"
        minHeight="48px"
        gap="12px"
        alignItems="center"
        justifyContent="center"
      >
        <IconClosed />
        <Typography.Div content="Closed" size="heading6" color="none" />
      </Flex.Row>
    </div>
  );
}

const Badge = {
  Featured,
  Sponsor,
  Closed,
};

export default Badge;

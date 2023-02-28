import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";

import IconClosed from "./icons/IconClosed";
import IconFeatured from "./icons/IconFeatured";
import IconSponsor from "./icons/IconSponsor";
import styles from "./index.module.scss";

import { ProjectGeneralInfo } from "@/modules/business-types";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectGeneralInfo["categories"] & { closed: boolean };
};

export default function BadgesViewer({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px" flexWrap="wrap">
        {value.closed ? (
          <Flex.Row
            className={styles.sponsorBadge}
            gap="12px"
            alignItems="center"
          >
            <IconClosed />
            <Title style={{ color: "#00362C" }} content="Closed" />
          </Flex.Row>
        ) : null}
        {value.featured ? (
          <Flex.Row
            className={styles.featuredBadge}
            gap="12px"
            alignItems="center"
          >
            <IconFeatured />
            <Title style={{ color: "#D200E4" }} content="Featured Project" />
          </Flex.Row>
        ) : null}
        {value.sponsor ? (
          <Flex.Row
            className={styles.sponsorBadge}
            gap="12px"
            alignItems="center"
          >
            <IconSponsor />
            <Title style={{ color: "#006E46" }} content="Sponsoring Teiki" />
          </Flex.Row>
        ) : null}
      </Flex.Row>
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { ProjectGeneralInfo } from "@/modules/business-types";
import Badge from "@/modules/teiki-components/components/Badge";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectGeneralInfo["categories"] & { closed: boolean };
};

export default function BadgesViewer({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px" flexWrap="wrap">
        {value.closed ? <Badge.Closed /> : null}
        {value.featured ? <Badge.Featured /> : null}
        {value.sponsor ? <Badge.Sponsor /> : null}
      </Flex.Row>
    </div>
  );
}

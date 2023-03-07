import cx from "classnames";
import Image from "next/image";
import * as React from "react";

import svgFlyingLeaves from "./assets/flying-leaves.svg";
import Activity from "./components/Activity";
import styles from "./index.module.scss";

import { sortedBy } from "@/modules/array-utils";
import { ProjectActivity } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

const MAX_DISPLAYED_ITEMS = 5;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity[];
  onClickAllActivities?: () => void;
  id: string | undefined;
};

export default function PanelActivities({
  className,
  style,
  value,
  onClickAllActivities,
  id,
}: Props) {
  const displayedActivities = sortedBy(value, (item) => -item.createdAt).slice(
    0,
    MAX_DISPLAYED_ITEMS
  );
  return (
    <div className={cx(styles.container, className)} style={style} id={id}>
      <Flex.Col gap="20px">
        <Typography.Div size="heading6" color="ink" content="Activities" />
        {displayedActivities.length ? (
          <>
            <Flex.Col className={styles.activityList} gap="16px">
              {displayedActivities.map((item, index) => (
                <Activity key={index} value={item} />
              ))}
            </Flex.Col>
            <Button.Outline
              content="All Activities"
              onClick={onClickAllActivities}
              size="medium"
            />
          </>
        ) : (
          <Flex.Col gap="10px" alignItems="center">
            <Image src={svgFlyingLeaves} alt="" width={96} height={96} />
            <Typography.Div
              size="bodySmall"
              color="ink80"
              content="No Activities"
            />
          </Flex.Col>
        )}
      </Flex.Col>
    </div>
  );
}

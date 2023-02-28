import cx from "classnames";
import * as React from "react";

import Activity from "./components/Activity";
import { IconCalendar } from "./icons/IconCalendar";
import styles from "./index.module.scss";

import { sortedBy } from "@/modules/array-utils";
import { ProjectActivity } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";

const MAX_DISPLAYED_ITEMS = 5;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity[];
  onClickAllActivities?: () => void;
  id: string;
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
      <h6 className={styles.label}>Activities</h6>
      <div className={styles.activityList}>
        {displayedActivities.length
          ? displayedActivities.map((item, index) => (
              <Activity key={index} value={item} />
            ))
          : "None"}
      </div>
      <Button.Outline
        className={styles.buttonAllActivities}
        icon={<IconCalendar />}
        content="All Activities"
        onClick={onClickAllActivities}
        size="large"
      />
    </div>
  );
}

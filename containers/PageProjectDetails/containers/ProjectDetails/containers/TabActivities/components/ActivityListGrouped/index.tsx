import cx from "classnames";
import moment from "moment";
import * as React from "react";

import ActivityList from "../ActivityList";
import YearIndicator from "../YearIndicator";

import styles from "./index.module.scss";

import { groupedBy, sortedBy } from "@/modules/array-utils";
import { ProjectActivity } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity[];
};

export default function ActivityListGrouped({
  className,
  style,
  value,
}: Props) {
  const sortedItems = sortedBy(value, (item) => -item.createdAt);
  const groupedItems = groupedBy(sortedItems, (item) =>
    item.createdAt ? moment(item.createdAt).year().toString() : "Past"
  );
  const groups = sortedBy(
    Object.entries(groupedItems),
    ([year]) => -parseInt(year)
  );

  return (
    <div className={cx(styles.container, className)} style={style}>
      {groups.map(([year, activities]) => (
        <div key={year}>
          <YearIndicator className={styles.yearIndicator} value={year} />
          <ActivityList className={styles.activityList} value={activities} />
        </div>
      ))}
    </div>
  );
}

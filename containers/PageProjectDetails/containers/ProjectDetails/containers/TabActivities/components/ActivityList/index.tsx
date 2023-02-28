import cx from "classnames";
import * as React from "react";

import Activity from "../Activity";

import styles from "./index.module.scss";

import { ProjectActivity } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity[];
};

export default function ActivityList({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.content}>
        {value
          .sort((a, b) => {
            if (!a.createdAt) return -1;
            if (!b.createdAt) return 1;
            return b.createdAt.valueOf() - a.createdAt.valueOf();
          })
          .map((activity, index) => (
            <Activity key={index} value={activity} />
          ))}
      </div>
    </div>
  );
}

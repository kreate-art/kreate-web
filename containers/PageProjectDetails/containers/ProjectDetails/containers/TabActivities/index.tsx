import cx from "classnames";
import * as React from "react";

import ActivityListGrouped from "./components/ActivityListGrouped";
import IconDownload from "./icons/IconDownload";
import styles from "./index.module.scss";

import { ProjectActivity } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity[];
  projectId: string;
};

export default function TabActivities({
  className,
  style,
  value,
  projectId,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Button.Outline
        className={styles.buttonDownload}
        icon={<IconDownload width="24px" />}
        content="Export CSV Data"
        size="large"
        onClick={async () => {
          const search = new URLSearchParams({ projectId });
          window.open(
            `/api/v1/export-backing-data?${search.toString()}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
      />
      <ActivityListGrouped value={value} />
    </div>
  );
}

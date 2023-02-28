import cx from "classnames";
import moment from "moment";

import styles from "./index.module.scss";

import { joinWithSeparator } from "@/modules/array-utils";
import { ProjectGeneralInfo } from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectGeneralInfo["history"] & { match: ProjectGeneralInfo["match"] };
};

type Entry = {
  label: string;
  content: string;
  tooltip: string | string[];
};

function formatToEntries(value: ProjectGeneralInfo["history"]): Entry[] {
  const result: Entry[] = [];
  const { createdAt, updatedAt, closedAt } = value;

  if (createdAt) {
    result.push({
      label: "Created on ",
      content: moment(createdAt).format("ll"),
      tooltip: [createdAt.toString(), moment(createdAt).format()],
    });
  }

  if (
    !closedAt &&
    updatedAt &&
    createdAt &&
    Number(updatedAt) !== Number(createdAt)
  ) {
    result.push({
      label: "Last updated ",
      content: moment(value.updatedAt).fromNow(),
      tooltip: [updatedAt.toString(), moment(updatedAt).format()],
    });
  }

  if (closedAt) {
    result.push({
      label: "Closed ",
      content: moment(value.closedAt).fromNow(),
      tooltip: [closedAt.toString(), moment(closedAt).format()],
    });
  }

  return result;
}

/**
 * Displays the creation time and last update time. For example:
 *
 * `Created on: 12 June 2022 | Last updated: 6 hours ago`
 */
export default function HistoryViewer({ className, style, value }: Props) {
  const entries = formatToEntries(value);
  const creationAndLastUpdate = entries.map((entry, index) => (
    <div key={index} className={styles.entry}>
      <span className={styles.label}>{entry.label}</span>
      <span
        className={styles.content}
        title={
          Array.isArray(entry.tooltip)
            ? entry.tooltip.join("\n")
            : entry.tooltip
        }
      >
        {entry.content}
      </span>
    </div>
  ));
  return (
    <div className={cx(styles.container, className)} style={style}>
      {joinWithSeparator(
        value.match === undefined
          ? creationAndLastUpdate
          : [
              <>
                <div className={styles.section}>
                  <span className={styles.match}>
                    {Math.round(value.match * 100)}% Match{" "}
                  </span>
                </div>
              </>,
              ...creationAndLastUpdate,
            ],
        <Divider.Vertical />
      )}
    </div>
  );
}

import cx from "classnames";
import moment from "moment";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  createdAt?: number;
  updatedAt?: number;
  inverted?: boolean;
};

export default function ProjectCreationAndUpdateTime({
  className,
  createdAt,
  updatedAt,
  inverted,
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        className,
        inverted ? styles.inverted : null
      )}
    >
      <div className={styles.section}>
        <span className={styles.label}>Created on </span>
        <span className={styles.value} title={moment(createdAt).format()}>
          {createdAt != null ? moment(createdAt).format("ll") : "-"}
        </span>
      </div>
      {createdAt !== updatedAt && (
        <>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <span className={styles.label}>Last updated </span>
            <span className={styles.value} title={moment(updatedAt).format()}>
              {updatedAt != null ? moment(updatedAt).fromNow() : "-"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

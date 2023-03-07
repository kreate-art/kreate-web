import cx from "classnames";

import { ProjectGeneralInfo } from "../../../../modules/business-types";

import styles from "./index.module.scss";
import { shortenNumber } from "./utils";

import { formatLovelaceAmount } from "@/modules/bigint-utils";

type Props = {
  className?: string;
  value: ProjectGeneralInfo["stats"];
  size?: "medium" | "large";
  inverted?: boolean;
};

export default function ProjectStats({
  className,
  value,
  size,
  inverted,
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        className,
        size === "large" ? styles.large : null,
        inverted ? styles.inverted : null
      )}
    >
      <div className={styles.box}>
        <div className={styles.value}>
          {value.numLovelacesRaised != null ? (
            <>
              {"≈ "}
              {shortenNumber(value.numLovelacesRaised, { shift: -6 })}
              {" ₳"}
            </>
          ) : (
            "-"
          )}
        </div>
        <div className={styles.legend}>Total income</div>
      </div>
      <div className={styles.box}>
        <div className={styles.value}>
          {value.numSupporters != null
            ? shortenNumber(value.numSupporters)
            : "-"}
        </div>
        <div className={styles.legend}>Backers</div>
      </div>
      <div className={styles.box}>
        <div className={styles.value}>
          {value.numLovelacesStaked != null ? (
            <>
              {"≈ "}
              {shortenNumber(value.numLovelacesStaked, { shift: -6 })}
              {" ₳"}
            </>
          ) : (
            "-"
          )}
        </div>
        <div className={styles.legend}>Active stake</div>
      </div>
    </div>
  );
}

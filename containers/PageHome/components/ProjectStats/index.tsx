import cx from "classnames";

import { ProjectGeneralInfo } from "../../../../modules/business-types";

import styles from "./index.module.scss";
import { shortenNumber } from "./utils";

import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";

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
          <AssetViewer.Usd.FromAda
            as="span"
            lovelaceAmount={
              value.numLovelacesStaked
                ? /** NOTE: @sk-tenba:
                   * monthly income = numLovelacesStaked / 100 * 3.5 / 12
                   */
                  (BigInt(value.numLovelacesStaked) * BigInt(35)) /
                  BigInt(12000)
                : undefined
            }
          />
        </div>
        <div className={styles.legend}>Monthly income</div>
      </div>
      <div className={styles.box}>
        <div className={styles.value}>
          {value.numSupporters != null
            ? shortenNumber(value.numSupporters)
            : "-"}
        </div>
        <div className={styles.legend}>Members</div>
      </div>
      <div className={styles.box}>
        <div className={styles.value}>
          <AssetViewer.Usd.FromAda
            as="span"
            lovelaceAmount={value.numLovelacesStaked}
          />
        </div>
        <div className={styles.legend}>Active stake</div>
      </div>
    </div>
  );
}

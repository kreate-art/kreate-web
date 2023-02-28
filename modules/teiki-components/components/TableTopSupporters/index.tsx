import cx from "classnames";
import * as React from "react";

import SupporterHandle from "./components/SupporterHandle";
import IconInfo from "./icons/IconInfo";
import IconTop1 from "./icons/IconTop1";
import IconTop2 from "./icons/IconTop2";
import IconTop3 from "./icons/IconTop3";
import styles from "./index.module.scss";

import { rankOf, sortedBy } from "@/modules/array-utils";
import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { SupporterInfo } from "@/modules/business-types";

const MAX_DISPLAYED_RANK = 10;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: SupporterInfo[];
};

export default function TableTopSupporters({ className, style, value }: Props) {
  // sort by amount  > remove zero-amount supporters > inject rank property > only display MAX_DISPLAYED_RANK items
  const sortedItems = sortedBy(value, (item) => -item.lovelaceAmount)
    .filter((item) => item.lovelaceAmount > 0)
    .map((item) => ({
      ...item,
      rank: rankOf(item, value, (value) => BigInt(value.lovelaceAmount)),
    }))
    .filter((item) => item.rank <= MAX_DISPLAYED_RANK);

  if (!sortedItems.length) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        <div className={styles.empty}>
          <IconInfo width="36px" height="36px" />
          <div>No supporters</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.table}>
        {sortedItems.map((item, index) => (
          <React.Fragment key={index}>
            <div className={styles.columnRank}>
              {/* TODO: @sk-umiuma -> @sk-kitsune: Implement the new top 3 design */}
              {item.rank === 1 ? (
                <IconTop1 />
              ) : item.rank === 2 ? (
                <IconTop2 />
              ) : item.rank === 3 ? (
                <IconTop3 />
              ) : (
                <span className={styles.circledNumber}>{item.rank}</span>
              )}
            </div>
            <SupporterHandle address={item.address} />
            <div
              className={styles.columnLovelaceAmount}
              title={`${item.lovelaceAmount}`}
            >
              {formatLovelaceAmount(item.lovelaceAmount, { compact: true }) +
                " ₳"}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

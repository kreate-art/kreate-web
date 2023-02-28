import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { formatLovelaceAmount, formatUsdAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";
import Title from "@/modules/teiki-ui/components/Title";

type Row = {
  label: React.ReactNode;
  value?: LovelaceAmount;
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  rows: Row[];
  title: React.ReactNode;
  adaPriceInUsd?: number;
  total?: LovelaceAmount;
  topSlot?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  loading?: boolean;
};

export default function PanelFeesBreakdown({
  className,
  style,
  rows,
  title,
  total,
  adaPriceInUsd,
  topSlot,
  bottomSlot,
  loading,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {topSlot}
      <Title className={styles.title} size="h6" content={title} />
      <Divider.Horizontal className={styles.divider} />
      <div className={styles.feeBreakdown}>
        {rows.map(({ label, value }, index) => (
          <div key={index} className={styles.feeBreakdownUnit}>
            {!loading ? (
              <>
                <div className={styles.label}>{label}</div>
                <div
                  className={styles.value}
                  title={value != null ? value?.toString() : "-"}
                >
                  {value != null
                    ? formatLovelaceAmount(value, {
                        includeCurrencySymbol: true,
                      })
                    : "-"}
                </div>
              </>
            ) : (
              <div className={cx(styles.loadingContainer, styles.breakdown)}>
                <div className={styles.loading} />
              </div>
            )}
          </div>
        ))}
      </div>
      <Divider.Horizontal className={styles.divider} />
      {!loading ? (
        <div className={styles.totalContainer}>
          <div className={styles.totalHeader}>Total</div>
          <div className={styles.totalValueContainer}>
            <div
              className={styles.totalValueInAda}
              title={total != null ? total.toString() : undefined}
            >
              {total != null
                ? formatLovelaceAmount(total, { includeCurrencySymbol: true })
                : "-"}
            </div>
            <div className={styles.totalValueInUsd}>
              {total != null && adaPriceInUsd != null
                ? formatUsdAmount(
                    { lovelaceAmount: total, adaPriceInUsd },
                    {
                      includeCurrencySymbol: true,
                      includeAlmostEqualToSymbol: true,
                    }
                  )
                : "-"}
            </div>
          </div>
        </div>
      ) : (
        <div className={cx(styles.loadingContainer, styles.total)}>
          <div className={styles.loading} />
        </div>
      )}
      {bottomSlot}
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";
import ImpactfulNumber from "../../components/ImpactfulNumber";

import IconProfit from "./icons/IconProfit";
import styles from "./index.module.scss";

import { formatLovelaceAmount, formatUsdAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: LovelaceAmount | null;
};

export default function TotalRaisedViewer({ className, style, value }: Props) {
  const { adaPriceInfo } = useAppContextValue$Consumer();
  return (
    <div className={cx(styles.container, className)} style={style}>
      <ImpactfulNumber
        icon={<IconProfit />}
        label="Total income"
        title={value?.toString()}
      >
        <Flex.Row gap="12px" alignItems="flex-end" flexWrap="wrap">
          <span className={styles.ada}>
            {value != null
              ? formatLovelaceAmount(value, { includeCurrencySymbol: true })
              : "-"}
          </span>
          {value && adaPriceInfo ? (
            <span className={styles.usd}>
              {formatUsdAmount(
                { lovelaceAmount: value, adaPriceInUsd: adaPriceInfo.usd },
                {
                  includeAlmostEqualToSymbol: true,
                  includeCurrencySymbol: true,
                }
              )}
            </span>
          ) : null}
        </Flex.Row>
      </ImpactfulNumber>
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import IconCoffeeToGo from "./icons/IconCoffeeToGo";
import styles from "./index.module.scss";

import { formatLovelaceAmount, formatUsdAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  lovelaceAmount?: LovelaceAmount;
};

export default function PanelContributedAmount({
  className,
  style,
  lovelaceAmount,
}: Props) {
  const appContextValue = useAppContextValue$Consumer();
  const adaPriceInUsd = appContextValue.adaPriceInfo?.usd;
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.title}>Contributed</div>
      <div className={styles.amount}>
        <div className={styles.lovelace} title={`${lovelaceAmount} lovelaces`}>
          {lovelaceAmount
            ? formatLovelaceAmount(lovelaceAmount, {
                compact: lovelaceAmount > BigInt(1e12),
                includeCurrencySymbol: true,
              })
            : "-"}
        </div>
        <div className={styles.usd} title={`1 ADA ≈ ${adaPriceInUsd} USD`}>
          {adaPriceInUsd && lovelaceAmount
            ? formatUsdAmount(
                { lovelaceAmount, adaPriceInUsd },
                {
                  includeAlmostEqualToSymbol: true,
                  includeCurrencySymbol: true,
                }
              )
            : "-"}
        </div>
      </div>
      <Button.Solid
        className={styles.buttonClaimReward}
        icon={<IconCoffeeToGo />}
        content="Claim Reward"
        size="large"
        color="white"
        disabled={!lovelaceAmount}
      />
    </div>
  );
}

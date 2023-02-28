import * as React from "react";

import IconWithdraw from "./components/IconWithdraw";
import styles from "./index.module.scss";

import { LovelaceAmount } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";

type Props = {
  lovelaceAmount: LovelaceAmount;
  onClick?: () => void;
};

export default function PanelWithdrawFund({ lovelaceAmount, onClick }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Available Funds</div>
      <AssetViewer.Ada.Compact
        className={styles.fund}
        as="div"
        lovelaceAmount={lovelaceAmount}
        size="heading2"
        color="white"
      />
      <AssetViewer.Usd.FromAda
        as="div"
        lovelaceAmount={lovelaceAmount}
        className={styles.usd}
        color="white"
      />
      <button className={styles.withdrawButton} onClick={onClick}>
        <IconWithdraw />
        Withdraw
      </button>
    </div>
  );
}

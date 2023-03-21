import IconLeaf from "./icons/IconLeaf";
import IconWithdraw from "./icons/IconWithdraw";
import styles from "./index.module.scss";

import { LovelaceAmount } from "@/modules/business-types";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  projectStatus: ProjectStatus;
  openModalBackProject?: () => void;
  openModalUnbackProject?: () => void;
  preview?: boolean;
  backedAmount?: LovelaceAmount;
  onUnbackSuccess?: (
    projectName: string,
    unbackedAmountLovelace: LovelaceAmount
  ) => void;
};

export default function PanelAdjustStake({
  projectStatus,
  openModalBackProject,
  openModalUnbackProject,
  preview = false,
  backedAmount,
}: Props) {
  return (
    <div className={styles.container}>
      <Title color="white100">Staking</Title>
      <AssetViewer.Ada.Standard
        className={styles.ada}
        color="white"
        size="heading2"
        lovelaceAmount={backedAmount}
        as="div"
      />
      <AssetViewer.Usd.FromAda
        className={styles.usd}
        as="div"
        lovelaceAmount={backedAmount ? backedAmount : 0}
        size="bodySmall"
        color="white"
      />
      <Button.Solid
        className={styles.backButton}
        icon={<IconLeaf />}
        size="large"
        color="white"
        content="Stake More"
        disabled={projectStatus === "closed" || projectStatus === "delisted"}
        onClick={!preview ? openModalBackProject : undefined}
      />
      <Button.Solid
        className={styles.withdrawButton}
        icon={<IconWithdraw />}
        content="Unstake"
        size="large"
        onClick={!preview ? openModalUnbackProject : undefined}
      />
    </div>
  );
}

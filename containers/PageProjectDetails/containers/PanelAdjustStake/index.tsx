import ModalUnbackProject from "./containers/ModalUnbackProject";
import IconLeaf from "./icons/IconLeaf";
import IconWithdraw from "./icons/IconWithdraw";
import styles from "./index.module.scss";

import { LovelaceAmount } from "@/modules/business-types";
import { useModalPromises } from "@/modules/modal-promises";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  projectName?: string;
  projectId?: string;
  backerAddress?: string;
  projectStatus: ProjectStatus;
  openModalBackProject?: () => void;
  preview?: boolean;
  backedAmount?: LovelaceAmount;
  onUnbackSuccess?: (
    projectName: string,
    unbackedAmountLovelace: LovelaceAmount
  ) => void;
};

export default function PanelAdjustStake({
  projectName = "",
  projectId = "",
  backerAddress = "",
  projectStatus,
  openModalBackProject,
  preview = false,
  backedAmount,
  onUnbackSuccess,
}: Props) {
  const { showModal } = useModalPromises();
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
        content="Back More"
        disabled={projectStatus === "closed" || projectStatus === "delisted"}
        onClick={!preview ? openModalBackProject : undefined}
      />
      <Button.Solid
        className={styles.withdrawButton}
        icon={<IconWithdraw />}
        content="Unback"
        size="large"
        onClick={async () => {
          if (!preview) {
            type ModalUnbackProject$ModalResult =
              | { type: "cancel" }
              | { type: "success"; unbackLovelaceAmount: LovelaceAmount };
            const modalResult = await showModal<ModalUnbackProject$ModalResult>(
              (resolve) => (
                <ModalUnbackProject
                  open
                  projectName={projectName}
                  projectId={projectId}
                  backedAmount={backedAmount ? backedAmount : 0}
                  projectStatus={projectStatus}
                  onCancel={() => resolve({ type: "cancel" })}
                  onSuccess={(event) =>
                    resolve({
                      type: "success",
                      unbackLovelaceAmount: event.unbackLovelaceAmount,
                    })
                  }
                />
              )
            );
            if (modalResult.type === "success") {
              onUnbackSuccess &&
                onUnbackSuccess(projectName, modalResult.unbackLovelaceAmount);
            }
          }
        }}
      />
    </div>
  );
}

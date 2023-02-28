import cx from "classnames";
import * as React from "react";

import ModalClaimReward from "./containers/ModalClaimReward";
import ModalClaimSuccess from "./containers/ModalClaimSuccess";
import PanelProtocolReward$Pure from "./containers/PanelProtocolReward$Pure";
import styles from "./index.module.scss";

import { Address } from "@/modules/business-types";
import { useModalPromises } from "@/modules/modal-promises";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import { useBackingHistory } from "@/modules/next-backend-client/hooks/useBackingHistory";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  backerAddress: Address;
  projectId: string;
  projectTitle: string | undefined;
  projectStatus?: ProjectStatus;
};

export default function PanelProtocolReward({
  className,
  style,
  backerAddress,
  projectId,
  projectTitle,
  projectStatus,
}: Props) {
  const { showModal } = useModalPromises();

  // TODO: @sk-kitsune: handle error properly
  const [backingHistory, _backingHistory$Error] = useBackingHistory({
    backerAddress,
    projectId,
  });

  const unclaimedAmount = backingHistory?.history?.numMicroTeikiUnclaimed;
  const claimedAmount = undefined; // TODO: @sk-saru teiki claim index !?

  const handleClickClaim = async () => {
    type ModalClaimReward$ModalResult =
      | { type: "canceled" }
      | { type: "success"; txHash: string };

    const modalClaimReward$ModalResult =
      await showModal<ModalClaimReward$ModalResult>((resolve) => (
        <ModalClaimReward
          open
          projectId={projectId}
          projectTitle={projectTitle}
          onCancel={() => resolve({ type: "canceled" })}
          onSuccess={({ txHash }) => resolve({ type: "success", txHash })}
          projectStatus={projectStatus}
          unclaimedAmount={unclaimedAmount}
        />
      ));

    if (modalClaimReward$ModalResult.type === "canceled") {
      return;
    }

    await showModal<void>((resolve) => (
      <ModalClaimSuccess
        open
        onClose={() => resolve()}
        projectTitle={projectTitle}
        txHash={modalClaimReward$ModalResult.txHash}
      />
    ));
  };
  if (!unclaimedAmount) return null;
  return (
    <div className={cx(styles.container, className)} style={style}>
      <PanelProtocolReward$Pure
        unclaimedAmount={unclaimedAmount}
        claimedAmount={claimedAmount}
        hideButtonHistory
        hideClaimedAmount
        onClickClaim={handleClickClaim}
      />
    </div>
  );
}

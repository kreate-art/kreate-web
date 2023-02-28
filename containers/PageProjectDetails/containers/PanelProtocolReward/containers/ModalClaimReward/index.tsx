import * as React from "react";

import ErrorBox from "../../../../../PageUpdateProjectV2/components/ErrorBox";
import { submitClaimTeikiTx } from "../../utils/submitClaimTeikiTx";

import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import IconRevenue from "./icons/IconRevenue";
import styles from "./index.module.scss";

import { formatMicroTeikiAmount, sumTxBreakdown } from "@/modules/bigint-utils";
import { MicroTeikiAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type SuccessEvent = {
  txHash: string;
};

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: (event: SuccessEvent) => void;
  projectId: string;
  projectTitle: string | undefined;
  projectStatus?: ProjectStatus;
  unclaimedAmount: MicroTeikiAmount | undefined;
};

export default function ModalClaimReward({
  open,
  onCancel,
  onSuccess,
  projectId,
  projectTitle,
  projectStatus,
  unclaimedAmount,
}: Props) {
  const { showMessage } = useToast();
  const { walletStatus } = useAppContextValue$Consumer();
  const [statusText, setStatusText] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
    [TxBreakdown | undefined, unknown]
  >([undefined, undefined]);

  const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
    projectId,
    backerAddress:
      walletStatus.status === "connected"
        ? walletStatus.info.address
        : undefined,
    projectStatus,
    disabled: busy,
  });

  const isTxBreakdownLoading =
    !txBreakdown$New$Error && !txBreakdown$New && !busy;

  React.useEffect(() => {
    if (busy) return;
    setTxBreakdown([txBreakdown$New, txBreakdown$New$Error]);
  }, [txBreakdown$New, txBreakdown$New$Error, busy]);

  const txBreakdown$DisplableError = txBreakdown$Error
    ? DisplayableError.from(txBreakdown$Error)
    : undefined;

  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected");

      const { txHash } = await submitClaimTeikiTx({
        lucid: walletStatus.lucid,
        projectId,
        backerAddress: walletStatus.info.address,
        projectStatus,
        onProgress: (statusText) => setStatusText(statusText),
      });

      onSuccess({ txHash });
    } catch (error) {
      const displayableError = DisplayableError.from(error);
      showMessage({
        title: displayableError.title,
        description: displayableError.description,
        color: "danger",
      });
      setStatusText("Failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open={open}
      closeOnDimmerClick={false}
      closeOnEscape={!busy}
      onClose={onCancel}
    >
      <Modal.Header>
        <Typography.Span color="ink" content="Claim Reward: " />
        <Typography.Span color="green" content={projectTitle} />
      </Modal.Header>
      <Modal.Content padding="none">
        <Flex.Row alignItems="stretch" flexWrap="wrap">
          <Flex.Row
            flex="10000 10000 294px"
            gap="24px"
            padding="32px 24px 32px 48px"
          >
            <IconRevenue />
            <Flex.Col gap="8px">
              <div className={styles.yourReward}>Your Reward</div>
              <div className={styles.unclaimedAmount}>
                {unclaimedAmount != null
                  ? formatMicroTeikiAmount(unclaimedAmount, {
                      includeCurrencySymbol: true,
                    })
                  : null}
              </div>
            </Flex.Col>
          </Flex.Row>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={
                txBreakdown?.unbacking !== undefined
                  ? [
                      { label: "Unbacking", value: txBreakdown?.unbacking },
                      {
                        label: "Transaction Fee",
                        value: txBreakdown?.transaction,
                      },
                    ]
                  : [
                      {
                        label: "Transaction Fee",
                        value: txBreakdown?.transaction,
                      },
                    ]
              }
              total={txBreakdown ? sumTxBreakdown(txBreakdown) : undefined}
              bottomSlot={
                txBreakdown$DisplableError ? (
                  <ErrorBox
                    style={{ marginTop: "16px" }}
                    title={txBreakdown$DisplableError.title}
                    description={txBreakdown$DisplableError.description}
                  />
                ) : null
              }
              loading={isTxBreakdownLoading}
            />
          </Flex.Row>
        </Flex.Row>
      </Modal.Content>
      <Modal.Actions>
        <Flex.Row
          flex="1 1 50px"
          justifyContent="stretch"
          alignItems="center"
          style={{ overflow: "hidden" }}
        >
          <Typography.Div size="heading6" content={statusText} />
        </Flex.Row>
        <Button.Outline content="Cancel" onClick={onCancel} disabled={busy} />
        <Button.Solid
          content="Claim Reward"
          disabled={busy || txBreakdown === undefined}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

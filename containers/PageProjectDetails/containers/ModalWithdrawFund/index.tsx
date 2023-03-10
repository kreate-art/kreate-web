import cx from "classnames";
import React from "react";

import {
  formatError$UseEstimatedFees$Result,
  Result,
  TxBreakdown,
  useEstimatedFees,
} from "./hooks/useEstimatedFees";
import styles from "./index.module.scss";
import { buildTx } from "./utils/transaction";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { useTxParams$CreatorWithdrawFund } from "@/modules/next-backend-client/hooks/useTxParams$CreatorWithdrawFund";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import Flex from "@/modules/teiki-components/components/PanelProjectOverview/components/Flex";
import IconRevenue from "@/modules/teiki-components/components/PanelProjectOverview/containers/ActiveStakeViewer/icons/IconRevenue";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type SuccessEvent = {
  txHash: string;
};

export type ModalWithdrawFund$SuccessEvent = SuccessEvent;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  withdrawableFundLovelaceAmount: LovelaceAmount;
  projectName: string;
  projectId: string;
  onCancel: () => void;
  onSuccess: (event: SuccessEvent) => void;
};

export default function ModalWithdrawFund({
  className,
  style,
  open,
  withdrawableFundLovelaceAmount,
  projectName,
  projectId,
  onCancel,
  onSuccess,
}: Props) {
  const { showMessage } = useToast();
  const adaPriceInfo = useAdaPriceInfo();
  const [busy, setBusy] = React.useState(false);
  const { walletStatus } = useAppContextValue$Consumer();
  const lucid =
    walletStatus.status === "connected" ? walletStatus.lucid : undefined;

  const txParamsResult = useTxParams$CreatorWithdrawFund({ projectId });

  const [estimatedFees, setEstimatedFees] = React.useState<Result | undefined>(
    undefined
  );
  const estimatedFees$New = useEstimatedFees({
    txParamsResult,
  });

  const isTxBreakdownLoading = !estimatedFees$New && !busy;

  React.useEffect(() => {
    if (busy) return;
    setEstimatedFees(estimatedFees$New);
  }, [busy, estimatedFees$New]);

  const feeBreakdown: TxBreakdown | undefined =
    estimatedFees?.error === null ? estimatedFees.txBreakdown : undefined;
  const formattedError$estimatedFees =
    formatError$UseEstimatedFees$Result(estimatedFees);

  const [statusBarText, setStatusBarText] = React.useState("");

  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(
        txParamsResult && !txParamsResult.error && txParamsResult.data.txParams,
        "tx params invalid"
      );

      setStatusBarText("Building transaction...");
      const { txComplete } = await buildTx({
        lucid: walletStatus.lucid,
        txParams: txParamsResult.data.txParams,
      });

      setStatusBarText("Waiting for signature...");
      const txCompleteSigned = await txComplete
        .sign()
        .complete()
        .catch((cause) => {
          console.error({ txComplete }); // for debugging purpose
          throw DisplayableError.from(cause, "Failed to sign");
        });

      setStatusBarText("Waiting for submission...");
      const txHash = await txCompleteSigned.submit().catch((cause) => {
        console.error({ txCompleteSigned });
        throw DisplayableError.from(cause, "Failed to submit");
      });

      setStatusBarText("Waiting for confirmation...");
      await walletStatus.lucid.awaitTx(txHash);

      setStatusBarText("Done.");
      onSuccess && onSuccess({ txHash });
    } catch (error) {
      const displayableError = DisplayableError.from(error);
      showMessage({
        title: displayableError.title,
        description: displayableError.description,
        color: "danger",
      });
      setStatusBarText("Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      className={cx(styles.container, className)}
      style={style}
      open={open}
      onOpenChange={onCancel}
      closeOnDimmerClick={false}
      closeOnEscape={!busy}
    >
      <Modal.Header>
        <Typography.Div size="heading4" maxLines={1} color="green">
          <Typography.Span content="Withdraw Fund: " color="ink" />
          <Typography.Span content={projectName} />
        </Typography.Div>
      </Modal.Header>
      <Modal.Content className={styles.modalContent} padding="none">
        <Flex.Row alignItems="stretch" flexWrap="wrap">
          <Flex.Col
            flex="10000 10000 294px"
            gap="32px"
            padding="32px 24px 32px 48px"
          >
            <Flex.Row gap="24px">
              <IconRevenue />
              <Flex.Col gap="8px">
                <Typography.Div
                  content="Your funds"
                  size="bodySmall"
                  color="ink80"
                />
                <AssetViewer.Ada.Standard
                  as="div"
                  lovelaceAmount={withdrawableFundLovelaceAmount}
                  size="heading2"
                  color="ink"
                />
                <AssetViewer.Usd.FromAda
                  as="div"
                  lovelaceAmount={withdrawableFundLovelaceAmount}
                  size="bodySmall"
                  color="ink80"
                />
              </Flex.Col>
            </Flex.Row>
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Withdraw", value: feeBreakdown?.withdraw },
                { label: "Protocol Fee", value: feeBreakdown?.protocol },
                { label: "Transaction Fee", value: feeBreakdown?.transaction },
              ]}
              total={feeBreakdown ? sumTxBreakdown(feeBreakdown) : undefined}
              adaPriceInUsd={adaPriceInfo?.usd}
              bottomSlot={
                <div>
                  {formattedError$estimatedFees ? (
                    <div
                      className={styles.errorBox}
                      title={formattedError$estimatedFees.tooltip}
                    >
                      {formattedError$estimatedFees.label}
                    </div>
                  ) : null}
                </div>
              }
              loading={isTxBreakdownLoading}
            />
          </Flex.Row>
        </Flex.Row>
      </Modal.Content>
      <Modal.Actions>
        <Flex.Row
          className={styles.statusTextContainer}
          flex="1 1 50px"
          justifyContent="stretch"
          alignItems="center"
          gap="10px"
        >
          {busy ? <IconSpin /> : null}
          <Typography.Span size="heading6" content={statusBarText} />
        </Flex.Row>
        <Button.Outline content="Cancel" onClick={onCancel} disabled={busy} />
        <Button.Solid
          content="Withdraw Fund"
          disabled={estimatedFees?.error !== null || !lucid || busy}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

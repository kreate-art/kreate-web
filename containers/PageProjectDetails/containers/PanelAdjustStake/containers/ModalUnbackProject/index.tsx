/* eslint-disable import/order */
import * as React from "react";

import styles from "./index.module.scss";
import { buildTx, BuildTxParams } from "./utils/transaction";

import {
  formatLovelaceAmount,
  formatUsdAmount,
  sumTxBreakdown,
} from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";

import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import * as AppContext from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import Input from "@/modules/teiki-ui/components/Input";
import Modal from "@/modules/teiki-ui/components/Modal";

import TextArea from "@/modules/teiki-ui/components/TextArea";

import Title from "@/modules/teiki-ui/components/Title";
import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import { assert } from "@/modules/common-utils";
import { useTxParams$BackerUnbackProject } from "@/modules/next-backend-client/hooks/useTxParams$BackerUnbackProject";
import {
  useField$Message,
  useField$UnbackLovelaceAmount,
} from "./hooks/useField";
import { ResultT, tryUntil } from "@/modules/async-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import Typography from "@/modules/teiki-ui/components/Typography";
import httpGetBackingActivitiesByTxHash from "@/modules/next-backend-client/api/httpGetBackingActivitiesByTxHash";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import Flex from "@/modules/teiki-ui/components/Flex";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";

type SuccessEvent = {
  unbackLovelaceAmount: LovelaceAmount;
};

type Props = {
  open: boolean;
  projectName: string;
  projectId: string;
  projectStatus: ProjectStatus;
  backedAmount: LovelaceAmount;
  onCancel: () => void;
  onSuccess: (event: SuccessEvent) => void;
};

export default function ModalUnbackProject({
  open,
  projectName,
  projectId,
  backedAmount,
  projectStatus,
  onCancel,
  onSuccess,
}: Props) {
  const { showMessage } = useToast();
  const [busy, setBusy] = React.useState(false);
  const { walletStatus, adaPriceInfo } =
    AppContext.useAppContextValue$Consumer();

  const fieldMessage = useField$Message();
  const fieldUnbackLovelaceAmount = useField$UnbackLovelaceAmount({
    max: backedAmount,
  });

  const txParamsResult = useTxParams$BackerUnbackProject({
    projectStatus,
    projectId,
    backerAddress:
      walletStatus.status === "connected"
        ? walletStatus.info.address
        : undefined,
  });

  const [txBreakdownResultT, setTxBreakdownResultT] = React.useState<
    ResultT<TxBreakdown> | undefined
  >(undefined);

  const txBreakdownResultT$New = useEstimatedFees({
    unbackLovelaceAmount:
      projectStatus !== "closed" && projectStatus !== "delisted"
        ? fieldUnbackLovelaceAmount.parsed
        : backedAmount,
    message: fieldMessage.parsed,
    projectStatus,
    txParamsResult,
    disabled: busy,
  });

  const isTxBreakdownLoading =
    !txBreakdownResultT$New &&
    !busy &&
    (projectStatus !== "closed" && projectStatus !== "delisted"
      ? fieldUnbackLovelaceAmount.parsed
      : backedAmount) != null;

  React.useEffect(() => {
    if (busy) return;
    setTxBreakdownResultT(txBreakdownResultT$New);
  }, [busy, txBreakdownResultT$New]);

  const txBreakdown: Partial<TxBreakdown> =
    txBreakdownResultT?.ok === true ? txBreakdownResultT.result : {};

  const displayableError =
    txBreakdownResultT?.ok === false
      ? DisplayableError.from(txBreakdownResultT.reason)
      : undefined;

  const waitUntilTxIndexed = async (txHash: string) => {
    await tryUntil({
      run: () => httpGetBackingActivitiesByTxHash({ txHash }),
      until: (response) => response.activities.length > 0,
    });
  };

  const [statusBarText, setStatusBarText] = React.useState("");
  const handleSubmit = async () => {
    setBusy(true);
    try {
      const unbackLovelaceAmount =
        projectStatus !== "closed" && projectStatus !== "delisted"
          ? fieldUnbackLovelaceAmount.parsed
          : backedAmount;
      const message = fieldMessage.parsed;
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(unbackLovelaceAmount != null && message != null, "missing inputs");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Building transaction...");
      const buildTx$Params: BuildTxParams = {
        lucid: walletStatus.lucid,
        backerAddress: walletStatus.info.address,
        unbackLovelaceAmount,
        projectStatus,
        message,
        action: "unback",
        txParams: txParamsResult.data.txParams,
      };
      const { txComplete } = await buildTx(buildTx$Params).catch((cause) => {
        console.error({ buildTx$Params }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to build transaction");
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
      await walletStatus.lucid.awaitTx(txHash).catch((cause) => {
        console.error({ txHash }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for confirmation");
      });

      setStatusBarText("Waiting for indexers...");
      await waitUntilTxIndexed(txHash).catch((cause) => {
        console.error({ txHash }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for indexers");
      });

      setStatusBarText("Done.");
      onSuccess && onSuccess({ unbackLovelaceAmount });
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
      open={open}
      closeOnDimmerClick={false}
      closeOnEscape={!busy}
      onClose={onCancel}
    >
      <Modal.Header>
        <Typography.Div size="heading4" maxLines={1} color="green">
          <Typography.Span content="Unstake: " color="ink" />
          <Typography.Span content={projectName} />
        </Typography.Div>
      </Modal.Header>
      <Modal.Content padding="none">
        <div className={styles.modalContent}>
          <div className={styles.inputContainer}>
            {projectStatus === "closed" ||
            projectStatus === "delisted" ? null : (
              <>
                <Title content="Amount:" size="h6" />
                <Input
                  placeholder="Enter amount"
                  className={styles.inputWithdraw}
                  value={fieldUnbackLovelaceAmount.text}
                  onChange={fieldUnbackLovelaceAmount.onTextChange}
                  disabled={busy}
                  error={
                    fieldUnbackLovelaceAmount.text !== "" &&
                    fieldUnbackLovelaceAmount.error
                      ? true
                      : false
                  }
                  rightSlot={
                    <>
                      <div className={styles.adaSymbol}>₳</div>
                      <button
                        className={styles.maxButton}
                        disabled={busy}
                        onClick={() =>
                          fieldUnbackLovelaceAmount.onTextChange(
                            formatLovelaceAmount(backedAmount, {
                              excludeThousandsSeparator: true,
                              useMaxPrecision: true,
                            })
                          )
                        }
                      >
                        Max
                      </button>
                    </>
                  }
                />
              </>
            )}
            <div className={styles.bottomSlotInfo}>
              {!fieldUnbackLovelaceAmount.text ? (
                <div></div>
              ) : fieldUnbackLovelaceAmount.error ? (
                <div className={styles.alert}>
                  {fieldUnbackLovelaceAmount.error}
                </div>
              ) : adaPriceInfo && fieldUnbackLovelaceAmount.parsed != null ? (
                <div>
                  {formatUsdAmount(
                    {
                      lovelaceAmount: fieldUnbackLovelaceAmount.parsed,
                      adaPriceInUsd: adaPriceInfo.usd,
                    },
                    {
                      includeAlmostEqualToSymbol: true,
                      includeCurrencySymbol: true,
                    }
                  )}
                </div>
              ) : (
                <div>{"-"}</div>
              )}
              <div className={styles.totalBacking}>
                <span>Your backing: </span>
                <span className={styles.backedAmount}>
                  <AssetViewer.Ada.Standard
                    as="span"
                    lovelaceAmount={backedAmount}
                  />
                </span>
              </div>
            </div>
            <Title
              className={styles.messageTitle}
              content={
                <div>
                  Message{" "}
                  <span className={styles.optionalTitle}>
                    (Optional, 1500 characters max)
                  </span>
                  {!!fieldMessage.error && (
                    <span style={{ color: "rgb(220, 32, 32)" }}>
                      {" "}
                      {fieldMessage.error}{" "}
                    </span>
                  )}
                </div>
              }
              size={"h6"}
            />
            <TextArea
              className={styles.textArea}
              value={fieldMessage.text}
              onChange={fieldMessage.setText}
              disabled={busy}
            />
            <span
              className={styles.characterCount}
            >{`${fieldMessage.text.length}/1500`}</span>
          </div>
          <PanelFeesBreakdown
            className={styles.feeBreakdown}
            title="Transaction Breakdown"
            rows={[
              { label: "Unstake", value: txBreakdown.unbacking },
              { label: "Transaction fee", value: txBreakdown.transaction },
            ]}
            total={sumTxBreakdown(txBreakdown)}
            adaPriceInUsd={adaPriceInfo?.usd}
            bottomSlot={
              displayableError ? (
                <div className={styles.errorBox}>
                  <div>
                    <strong>{displayableError.title}</strong>
                  </div>
                  {displayableError.description ? (
                    <div>{displayableError.description}</div>
                  ) : null}
                </div>
              ) : null
            }
            loading={isTxBreakdownLoading}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <div className={styles.actionsContainer}>
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
          <div className={styles.buttonActionContainer}>
            <Button.Outline
              content="Cancel"
              onClick={onCancel}
              disabled={busy}
            />
            <Button.Solid
              content="Submit"
              onClick={handleSubmit}
              disabled={txBreakdownResultT?.ok !== true || busy}
            />
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  );
}

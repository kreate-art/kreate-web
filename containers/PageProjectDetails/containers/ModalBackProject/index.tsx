import { signAndSubmit } from "@teiki/protocol/helpers/lucid";
import cx from "classnames";
import * as React from "react";

import ErrorBox from "../../../PageUpdateProjectV2/components/ErrorBox";

import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import { useSupportProjectLogic } from "./hooks/useSupportProjectLogic";
import styles from "./index.module.scss";
import { buildTx } from "./utils/transaction";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { throw$, try$, tryUntil } from "@/modules/async-utils";
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import httpGetBackingActivitiesByTxHash from "@/modules/next-backend-client/api/httpGetBackingActivitiesByTxHash";
import { useTxParams$BackerBackProject } from "@/modules/next-backend-client/hooks/useTxParams$BackerBackProject";
import InputLovelaceAmount from "@/modules/teiki-components/components/InputLovelaceAmount";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import TextArea from "@/modules/teiki-ui/components/TextArea";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type SuccessEvent = {
  lovelaceAmount: LovelaceAmount;
};

export type ModalBackProject$SuccessEvent = SuccessEvent;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  projectName: string;
  projectId: string;
  onCancel?: () => void;
  onSuccess?: (event: SuccessEvent) => void;
};

export default function ModalBackProject({
  className,
  style,
  open,
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
  const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
    [TxBreakdown | undefined, unknown]
  >([undefined, undefined]);
  const { input, syntaxError, output } = useSupportProjectLogic();
  const txParamsResult = useTxParams$BackerBackProject({ projectId });

  const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
    txParamsResult,
    projectId,
    lovelaceAmount: output.lovelaceAmount,
    message: output.message,
    disabled: busy,
  });

  const isTxBreakdownLoading =
    !txBreakdown$New$Error &&
    !txBreakdown$New &&
    !busy &&
    output.lovelaceAmount !== undefined;

  React.useEffect(() => {
    if (busy) return;
    setTxBreakdown([txBreakdown$New, txBreakdown$New$Error]);
  }, [txBreakdown$New, txBreakdown$New$Error, busy]);

  const txBreakdown$DisplableError = txBreakdown$Error
    ? DisplayableError.from(txBreakdown$Error)
    : undefined;

  const [statusBarText, setStatusBarText] = React.useState("");

  const waitUntilTxIndexed = async (txHash: string) => {
    await tryUntil({
      run: () => httpGetBackingActivitiesByTxHash({ txHash }),
      until: (response) => response.activities.length > 0,
    });
  };

  const handleSubmit = async () => {
    if (output.lovelaceAmount == null) return;
    setBusy(true);
    try {
      const { lovelaceAmount, message } = output;
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(lovelaceAmount != null && message != null, "invalid inputs");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Building transaction...");
      const { txComplete } = await try$(
        async () =>
          await buildTx({
            lucid: walletStatus.lucid,
            lovelaceAmount,
            message,
            txParams: txParamsResult.data.txParams,
          }),
        (cause) => throw$(new Error("failed to build tx", { cause }))
      );

      setStatusBarText("Waiting for signature and submission...");
      const txHash = await try$(
        async () => await signAndSubmit(txComplete),
        (cause) => throw$(new Error("failed to sign or submit", { cause }))
      );

      setStatusBarText("Waiting for confirmation...");
      await walletStatus.lucid.awaitTx(txHash);
      await waitUntilTxIndexed(txHash);

      setStatusBarText("Done.");
      onSuccess && onSuccess({ lovelaceAmount });
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
          <Typography.Span content="Backing: " color="ink" />
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
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <fieldset className={styles.fieldset}>
                <Title className={styles.fieldLabel} content="Amount" />
                <InputLovelaceAmount
                  value={input.lovelaceAmount}
                  onChange={input.setLovelaceAmount}
                  inlineError={syntaxError.lovelaceAmount}
                  lovelaceAmount={output.lovelaceAmount}
                  maxLovelaceAmount={output.maxLovelaceAmount}
                  disabled={busy}
                />
              </fieldset>
              <fieldset className={styles.fieldset}>
                <Title className={styles.fieldLabel}>
                  <span>Message</span>
                  <span style={{ fontWeight: "400", fontSize: "12px" }}>
                    {" (Optional, 1500 characters max)"}
                  </span>
                  {!!syntaxError.message && (
                    <span style={{ color: "rgb(220, 32, 32)" }}>
                      {" "}
                      {syntaxError.message}
                    </span>
                  )}
                </Title>
                <TextArea
                  className={styles.inputMessage}
                  value={input.message}
                  onChange={input.setMessage}
                  rows={5}
                  disabled={busy}
                />
                <span
                  className={styles.characterCount}
                >{`${input.message.length}/1500`}</span>
              </fieldset>
            </form>
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Back", value: txBreakdown?.back },
                { label: "Transaction Fee", value: txBreakdown?.transaction },
              ]}
              total={txBreakdown ? sumTxBreakdown(txBreakdown) : undefined}
              adaPriceInUsd={adaPriceInfo?.usd}
              bottomSlot={
                <div>
                  {txBreakdown$DisplableError ? (
                    <ErrorBox
                      style={{ marginTop: "16px" }}
                      title={txBreakdown$DisplableError.title}
                      description={txBreakdown$DisplableError.description}
                      tooltip={txBreakdown$DisplableError.description}
                    />
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
          content="Back Project"
          disabled={txBreakdown === undefined || !lucid || busy}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

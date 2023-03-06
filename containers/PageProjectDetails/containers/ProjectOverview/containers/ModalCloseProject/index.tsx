import { signAndSubmit } from "@teiki/protocol/helpers/lucid";
import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import ErrorBox from "../../../../../PageUpdateProjectV2/components/ErrorBox";
import InfoBox from "../../../../../PageUpdateProjectV2/components/InfoBox";

import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import styles from "./index.module.scss";
import { buildTx } from "./utils/transactions";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { ResultT } from "@/modules/async-utils";
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { useTxParams$CreatorCloseProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorCloseProject";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Checkbox from "@/modules/teiki-ui/components/Checkbox";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
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
  onSuccess?: () => void;
};

export default function ModalCloseProject({
  className,
  style,
  open,
  projectName,
  projectId,
  onCancel,
  onSuccess,
}: Props) {
  const { showMessage } = useToast();
  const router = useRouter();
  const adaPriceInfo = useAdaPriceInfo();
  const [busy, setBusy] = React.useState(false);
  const { walletStatus } = useAppContextValue$Consumer();
  const txParamsResult = useTxParams$CreatorCloseProject({ projectId });

  const [shouldCloseProject, setShouldCloseProject] = React.useState(false);

  const [txBreakdown$ResultT, setTxBreakdown$ResultT] = React.useState<
    ResultT<TxBreakdown> | undefined
  >(undefined);
  const txBreakdown$New$ResultT = useEstimatedFees({
    projectId,
    disabled: busy,
  });

  const isTxBreakdownLoading = !txBreakdown$New$ResultT && !busy;

  React.useEffect(() => {
    if (busy) return;
    setTxBreakdown$ResultT(txBreakdown$New$ResultT);
  }, [busy, txBreakdown$New$ResultT]);

  const txBreakdown: TxBreakdown | undefined = txBreakdown$ResultT?.ok
    ? txBreakdown$ResultT.result
    : undefined;

  const txBreakdown$DisplableError =
    txBreakdown$ResultT?.ok === false
      ? DisplayableError.from(txBreakdown$ResultT.reason)
      : undefined;

  const [statusBarText, setStatusBarText] = React.useState("");

  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Building transaction...");
      const buildTx$Params = {
        lucid: walletStatus.lucid,
        txParams: txParamsResult.data.txParams,
      };
      const { txComplete } = await buildTx(buildTx$Params).catch((cause) => {
        console.error({ buildTx$Params }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to build transaction");
      });

      setStatusBarText("Waiting for signature and submission...");
      const txHash = await signAndSubmit(txComplete).catch((cause) => {
        console.error({ txComplete }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to sign or submit");
      });

      setStatusBarText("Waiting for confirmation...");
      await walletStatus.lucid.awaitTx(txHash).catch((cause) => {
        console.error({ txHash }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for confirmation");
      });

      setStatusBarText("Done.");
      onSuccess && onSuccess();
      /**refresh data */
      router.replace(router.asPath);
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
      onClose={onCancel}
      closeOnDimmerClick={false}
      closeOnEscape={!busy}
    >
      <Modal.Header>
        <Typography.Div size="heading4" maxLines={1} color="green">
          <Typography.Span content="Close Project: " color="ink" />
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
            <fieldset className={styles.fieldset}>
              <InfoBox
                style={{ whiteSpace: "pre-line", marginBottom: "16px" }}
                title="Take caution before closing your project"
                description={`1. It cannot be undone.
                2. Please announce clearly for backers to unback.
                3. You get back all your pledge and remaining funds.
                4. The closure may require several transactions depending on how complicated your project is.`}
              />
              {/* TODO: @sk-umiuma: revert this when scheduled closure is ready */}
              {/* <RadioButtonGroup title="Select your closing schedule"></RadioButtonGroup> */}
            </fieldset>
            <fieldset className={styles.fieldset}>
              <Checkbox
                label={<span>I understand and want to close my project</span>}
                value={shouldCloseProject}
                onChange={setShouldCloseProject}
                disabled={busy}
              />
            </fieldset>
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Pledge Return", value: txBreakdown?.pledge },
                { label: "Transaction Fee", value: txBreakdown?.transaction },
              ]}
              total={txBreakdown ? sumTxBreakdown(txBreakdown) : undefined}
              adaPriceInUsd={adaPriceInfo?.usd}
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
          content="Close Project"
          disabled={busy || !shouldCloseProject || !txBreakdown$ResultT?.ok}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

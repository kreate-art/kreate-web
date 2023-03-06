import { signAndSubmit } from "@teiki/protocol/helpers/lucid";
import cx from "classnames";
import * as React from "react";

import ErrorBox from "../../../../../PageUpdateProjectV2/components/ErrorBox";
import { useCreateProjectLogic } from "../../hooks/useCreateProjectLogic";
import { TxBreakdown, useEstimatedFees } from "../../hooks/useEstimatedFees";
import { BuildTxParams } from "../../utils/transactions";
import { buildTx, waitUntilProjectIndexed } from "../../utils/transactions";

import InputLovelaceAmount$Sponsor from "./components/InputLovelaceAmount$Sponsor";
import styles from "./index.module.scss";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { Project } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { useTxParams$CreatorCreateProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorCreateProject";
import { ipfsAdd$WithBufsAs$Blob } from "@/modules/next-backend-client/utils/ipfsAdd$WithBufsAs$Blob";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";
import CodecBlob from "@/modules/with-bufs-as-converters/codecs/CodecBlob";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  project: Project;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function ModalSubmit({
  className,
  style,
  open,
  project,
  onCancel,
  onSuccess,
}: Props) {
  const adaPriceInfo = useAdaPriceInfo();
  const [busy, setBusy] = React.useState(false);
  const { walletStatus } = useAppContextValue$Consumer();
  const txParamsResult = useTxParams$CreatorCreateProject();
  const { input, syntaxError, output } = useCreateProjectLogic({
    projectSponsorshipMinFee:
      txParamsResult?.error == null
        ? txParamsResult?.computed.protocolParams.projectSponsorshipMinFee
        : undefined,
  });
  const { showMessage } = useToast();
  const [sponsorInputOpen, setSponsorInputOpen] = React.useState(false);

  const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
    [TxBreakdown | undefined, unknown]
  >([undefined, undefined]);

  const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
    txParamsResult,
    sponsorshipAmount: output.lovelaceAmount,
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

  const handleSubmit = async () => {
    setBusy(true);
    try {
      const { lovelaceAmount } = output;
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(lovelaceAmount != null, "invalid inputs");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Uploading files to IPFS...");
      const projectWBA$Blob: WithBufsAs<Project, Blob> =
        await Converters.fromProject(CodecBlob)(project).catch((cause) => {
          console.error({ project }); // for debugging purpose
          throw DisplayableError.from(cause, "Failed to serialize project.");
        });
      const informationCid = await ipfsAdd$WithBufsAs$Blob(
        projectWBA$Blob
      ).catch((cause) => {
        console.error({ projectWBA$Blob }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to upload files to IPFS");
      });

      setStatusBarText("Building transaction...");
      const buildTx$Params: BuildTxParams = {
        lucid: walletStatus.lucid,
        informationCid,
        ownerAddress: walletStatus.info.address,
        sponsorshipAmount: lovelaceAmount,
        protocolParamsUtxo: txParamsResult.data.protocolParamsUtxo,
        projectAtScriptReferenceUtxo:
          txParamsResult.data.projectAtScriptReferenceUtxo,
      };
      const { txComplete, projectId } = await buildTx(buildTx$Params).catch(
        (cause) => {
          console.error({ buildTx$Params }); // for debugging purpose
          throw DisplayableError.from(cause, "Failed to build transaction");
        }
      );

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

      setStatusBarText("Waiting for indexers...");
      await waitUntilProjectIndexed(projectId).catch((cause) => {
        console.error({ projectId }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for indexers");
      });

      setStatusBarText("Done.");
      onSuccess && onSuccess();
    } catch (error) {
      const displayableError = DisplayableError.from(
        error,
        "Failed to create project"
      );
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
      <Modal.Header content="Extra" />
      <Modal.Content padding="none" className={styles.modalContent}>
        <Flex.Row alignItems="stretch" flexWrap="wrap">
          <Flex.Col flex="10000 10000 294px" padding="32px 48px" gap="24px">
            <Typography.Div content="Sponsor Teiki" size="heading6" />
            <MessageBox
              title="Sponsors are auto-listed in the homepage for more exposure."
              description="Sponsorship can be renewed monthly. Inappropriate sponsors can still be hidden, delisted, and fined the pledge."
            />
            <InputLovelaceAmount$Sponsor
              open={sponsorInputOpen}
              value={input.lovelaceAmount}
              onChange={input.setLovelaceAmount}
              onBlur={() => setSponsorInputOpen(false)}
              onFocus={() => setSponsorInputOpen(true)}
              inlineError={syntaxError.lovelaceAmount}
              lovelaceAmount={output.lovelaceAmount}
              disabled={busy}
            />
          </Flex.Col>
          <Flex.Col flex="1 1 294px" justifyContent="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Pledge", value: txBreakdown?.pledge },
                { label: "Sponsorship", value: txBreakdown?.sponsor },
                { label: "Creation Fee", value: txBreakdown?.creation },
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
          </Flex.Col>
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
        <Button.Outline content="Exit" onClick={onCancel} disabled={busy} />
        <Button.Outline
          content="Preview"
          onClick={() =>
            // TODO: @sk-kitsune: use the absolute URL instead (starts with slash)
            window.open("preview", "_blank", "noopener,noreferrer")
          }
          disabled={busy}
        />
        <Button.Solid
          content="Submit"
          onClick={handleSubmit}
          disabled={
            txBreakdown === undefined || busy || project.basics.customUrl === ""
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

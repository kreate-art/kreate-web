import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import ErrorBox from "../../../PageUpdateProjectV2/components/ErrorBox";

import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import { useQuoteGKNft$Nft } from "./hooks/useQuoteGKNft$Nft";
import styles from "./index.module.scss";
import { buildTx, BuildTxParams } from "./utils/transaction";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { tryUntil } from "@/modules/async-utils";
import {
  formatLovelaceAmount,
  sumLovelaceAmount,
  sumTxBreakdown,
} from "@/modules/bigint-utils";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import httpGetGenesisKreationMintedByTxId from "@/modules/next-backend-client/api/httpGetGenesisKreationMintedByTxId";
import { httpGetQuoteGKNft } from "@/modules/next-backend-client/api/httpGetQuoteGKNft";
import { httpPostMintGKNftTx } from "@/modules/next-backend-client/api/httpPostMintGKNftTx";
import { useTxParams$UserMintGKNft } from "@/modules/next-backend-client/hooks/useTxParams$UserMintGKNft";
import ImageView from "@/modules/teiki-components/components/ImageView";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import ComboBox from "@/modules/teiki-ui/components/ComboBox";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import TextArea from "@/modules/teiki-ui/components/TextArea";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  genesisKreation: GenesisKreationEntry;
  open: boolean;
  onCancel?: () => void;
  onSuccess?: (txHash: string) => void;
};

export default function ModalMintGenesisKreation({
  className,
  style,
  genesisKreation,
  open,
  onCancel,
  onSuccess,
}: Props) {
  const { showMessage } = useToast();
  const adaPriceInfo = useAdaPriceInfo();
  const [busy, setBusy] = React.useState(false);
  const { walletStatus } = useAppContextValue$Consumer();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const lucid =
    walletStatus.status === "connected" ? walletStatus.lucid : undefined;
  const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
    [TxBreakdown | undefined, unknown]
  >([undefined, undefined]);

  const txParamsResult = useTxParams$UserMintGKNft();
  const quoteResult = useQuoteGKNft$Nft({
    id: genesisKreation.id,
    address:
      walletStatus.status === "connected" ? walletStatus.info.address : "",
  });

  const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
    txParamsResult,
    quoteResult,
    name,
    description,
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

  const [statusBarText, setStatusBarText] = React.useState("");

  const waitUntilTxIndexed = async (txId: string) => {
    await tryUntil({
      run: () => httpGetGenesisKreationMintedByTxId({ txId }),
      until: (response) => response.kreations.length > 0,
    });
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Quoting kolours...");
      const { quotation, signature, status } = await httpGetQuoteGKNft({
        id: genesisKreation.id,
        address: walletStatus.info.address,
      }).catch((cause) => {
        throw DisplayableError.from(cause, "Failed to quote GK");
      });
      // TODO: Better handling...
      assert(signature, "Must have signature");

      setStatusBarText("Building transaction...");
      const buildTx$Params: BuildTxParams = {
        lucid: walletStatus.lucid,
        name,
        description,
        quotation,
        txParams: txParamsResult.data.txParams,
      };
      const { txComplete } = await buildTx(buildTx$Params).catch((cause) => {
        console.error({ buildTx$Params }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to build transaction");
      });

      setStatusBarText("Waiting for signature...");
      const txUserSigned = await txComplete.sign().complete();

      setStatusBarText("Waiting for submission...");
      const { txId } = await httpPostMintGKNftTx({
        quotation,
        signature,
        txHex: txUserSigned.toString(),
      });

      setStatusBarText("Waiting for confirmation...");
      await walletStatus.lucid.awaitTx(txId).catch((cause) => {
        console.error({ txId }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for confirmation");
      });

      setStatusBarText("Waiting for indexers...");
      await waitUntilTxIndexed(txId).catch((cause) => {
        console.error({ txId }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for indexers");
      });

      setStatusBarText("Done.");
      onSuccess && onSuccess(txId);
    } catch (error) {
      const displayableError = DisplayableError.from(
        error,
        "Failed to mint genesis kolour nft"
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
      <Modal.Header>
        <Typography.Div size="heading4" maxLines={1} color="green">
          <Typography.Span content="Kreataverse Minting!" color="ink" />
        </Typography.Div>
      </Modal.Header>
      <Modal.Content className={styles.modalContent} padding="none">
        <Flex.Row alignItems="stretch" flexWrap="wrap">
          <Flex.Col
            flex="10000 10000 294px"
            gap="24px"
            padding="32px 24px 48px 48px"
          >
            <Flex.Col className={styles.genesis}>
              <WithAspectRatio
                aspectRatio={2 / 1}
                className={styles.imageContainer}
              >
                <ImageView
                  className={styles.image}
                  src={genesisKreation.finalImage.src}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                />
              </WithAspectRatio>
            </Flex.Col>
            <ComboBox.Text
              value={name}
              onChange={setName}
              suggestions={[]}
              label="Name your region! 🏔️"
            />
            <Flex.Col gap="12px">
              <Typography.Div content="Why is it awesome? 🤙" size="heading6" />
              <TextArea value={description} onChange={setDescription} />
            </Flex.Col>
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                {
                  label: "Genesis Kreation NFT",
                  value: txBreakdown?.genesisKreation,
                },
                { label: "Transaction Fee", value: txBreakdown?.transaction },
                { label: "IKO Discount", value: txBreakdown?.ikoDiscount },
                { label: "SSPO Discount", value: txBreakdown?.sspoDiscount },
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
          content="Submit"
          disabled={txBreakdown === undefined || !lucid || busy}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

import cx from "classnames";
import * as React from "react";

import ErrorBox from "../../../PageUpdateProjectV2/components/ErrorBox";

import KolourGrid from "./containers/KolourGrid";
import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import { useQuoteKolourNft$Nft } from "./hooks/useQuoteKolourNft";
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
import { GenesisKreationEntry, Layer } from "@/modules/kolours/types/Kolours";
import httpGetKoloursMintedByTxHash from "@/modules/next-backend-client/api/httpGetKoloursMintedByTxHash";
import { httpGetQuoteKolourNft } from "@/modules/next-backend-client/api/httpGetQuoteKolourNft";
import { httpPostMintKolourNftTx } from "@/modules/next-backend-client/api/httpPostMintKolourNftTx";
import { useTxParams$UserMintKolourNft } from "@/modules/next-backend-client/hooks/useTxParams$UserMintKolourNft";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";
import WithAspectRatio from "../../../../components/WithAspectRatio";
import ImageView from "@/modules/teiki-components/components/ImageView";
import ComboBox from "@/modules/teiki-ui/components/ComboBox";
import TextArea from "@/modules/teiki-ui/components/TextArea";

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
  // const [selectedKolours, setSelectedKolours] = React.useState(kolours);
  // const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
  //   [TxBreakdown | undefined, unknown]
  // >([undefined, undefined]);

  // const txParamsResult = useTxParams$UserMintKolourNft();
  // const quoteResult = useQuoteKolourNft$Nft({
  //   kolours: selectedKolours.map((item) => item.kolour),
  //   address:
  //     walletStatus.status === "connected" ? walletStatus.info.address : "",
  // });

  // const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
  //   txParamsResult,
  //   quoteResult,
  //   disabled: busy,
  // });

  // const isTxBreakdownLoading =
  //   !txBreakdown$New$Error && !txBreakdown$New && !busy;

  // React.useEffect(() => {
  //   if (busy) return;
  //   setTxBreakdown([txBreakdown$New, txBreakdown$New$Error]);
  // }, [txBreakdown$New, txBreakdown$New$Error, busy]);

  // const txBreakdown$DisplableError = txBreakdown$Error
  //   ? DisplayableError.from(txBreakdown$Error)
  //   : undefined;

  const [statusBarText, setStatusBarText] = React.useState("");

  const waitUntilTxIndexed = async (txHash: string) => {
    await tryUntil({
      run: () => httpGetKoloursMintedByTxHash({ txHash }),
      until: (response) => typeof response.kolour === "string",
    });
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      // assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Quoting kolours...");
      // const { quotation, signature } = await httpGetQuoteKolourNft({
      //   kolours: selectedKolours.map((item) => item.kolour),
      //   address: walletStatus.info.address,
      // }).catch((cause) => {
      //   throw DisplayableError.from(cause, "Failed to quote kolours");
      // });

      setStatusBarText("Building transaction...");
      // const buildTx$Params: BuildTxParams = {
      //   lucid: walletStatus.lucid,
      //   quotation,
      //   txParams: txParamsResult.data.txParams,
      // };
      // const { txComplete } = await buildTx(buildTx$Params).catch((cause) => {
      //   console.error({ buildTx$Params }); // for debugging purpose
      //   throw DisplayableError.from(cause, "Failed to build transaction");
      // });

      setStatusBarText("Waiting for signature...");
      // const txUserSigned = await txComplete.sign().complete();

      setStatusBarText("Waiting for submission...");
      // const { txId } = await httpPostMintKolourNftTx({
      //   txHex: txUserSigned.toString(),
      //   quotation,
      //   signature,
      // });

      setStatusBarText("Waiting for confirmation...");
      // await walletStatus.lucid.awaitTx(txId).catch((cause) => {
      //   console.error({ txId }); // for debugging purpose
      //   throw DisplayableError.from(cause, "Failed to wait for confirmation");
      // });

      setStatusBarText("Waiting for indexers...");
      // await waitUntilTxIndexed(txId).catch((cause) => {
      //   console.error({ txId }); // for debugging purpose
      //   throw DisplayableError.from(cause, "Failed to wait for indexers");
      // });

      setStatusBarText("Done.");
      // onSuccess && onSuccess(txId);
    } catch (error) {
      const displayableError = DisplayableError.from(
        error,
        "Failed to mint kolour nft"
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
          <Typography.Span content="Mint Kolours" color="ink" />
        </Typography.Div>
      </Modal.Header>
      <Modal.Content className={styles.modalContent} padding="none">
        <Flex.Row alignItems="stretch" flexWrap="wrap">
          <Flex.Col
            flex="10000 10000 294px"
            gap="32px"
            padding="32px 24px 32px 48px"
          >
            <Flex.Col className={styles.genesis}>
              <WithAspectRatio aspectRatio={5 / 3} className={styles.image}>
                {/* <ImageView
                  className={styles.image}
                  src={genesisKreation.initialImage.src}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                /> */}
              </WithAspectRatio>
              <Flex.Row alignItems="center" gap="12px" padding="16px 24px">
                <Typography.Span
                  content={
                    genesisKreation.listedFee != null
                      ? formatLovelaceAmount(genesisKreation.listedFee, {
                          compact: true,
                          includeCurrencySymbol: true,
                        })
                      : "-"
                  }
                  size="heading6"
                />
                <Typography.Span
                  content={
                    genesisKreation.listedFee != null
                      ? formatLovelaceAmount(
                          sumLovelaceAmount([
                            genesisKreation.listedFee,
                            genesisKreation.listedFee,
                          ]),
                          { compact: true, includeCurrencySymbol: true }
                        )
                      : "-"
                  }
                  size="bodySmall"
                  color="secondary50"
                  style={{ textDecoration: "line-through" }}
                />
              </Flex.Row>
            </Flex.Col>
            <ComboBox.Text
              value={name}
              onChange={setName}
              suggestions={[]}
              label="Name your region"
            />
            <Flex.Col gap="12px">
              <Typography.Div content="Tell the story" size="heading6" />
              <TextArea value={description} onChange={setDescription} />
            </Flex.Col>
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Kolours", value: 0 },
                { label: "Transaction Fee", value: 0 },
                { label: "IKO Discount", value: 0 },
                { label: "SSPO Discount", value: 0 },
              ]}
              total={0}
              adaPriceInUsd={adaPriceInfo?.usd}
              bottomSlot={
                <></>
                // <div>
                //   {txBreakdown$DisplableError ? (
                //     <ErrorBox
                //       style={{ marginTop: "16px" }}
                //       title={txBreakdown$DisplableError.title}
                //       description={txBreakdown$DisplableError.description}
                //       tooltip={txBreakdown$DisplableError.description}
                //     />
                //   ) : null}
                // </div>
              }
              loading={false}
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
          // disabled={txBreakdown === undefined || !lucid || busy}
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

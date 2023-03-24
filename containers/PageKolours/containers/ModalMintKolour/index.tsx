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
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { Layer } from "@/modules/kolours/types/Kolours";
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

type Props = {
  className?: string;
  style?: React.CSSProperties;
  kolours: Layer[];
  open: boolean;
  onCancel?: () => void;
  onSuccess?: (txHash: string) => void;
};

export default function ModalMintKolourNft({
  className,
  style,
  kolours,
  open,
  onCancel,
  onSuccess,
}: Props) {
  const { showMessage } = useToast();
  const adaPriceInfo = useAdaPriceInfo();
  const [busy, setBusy] = React.useState(false);
  const { walletStatus } = useAppContextValue$Consumer();
  const [selectedKolours, setSelectedKolours] = React.useState(kolours);
  const lucid =
    walletStatus.status === "connected" ? walletStatus.lucid : undefined;
  const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
    [TxBreakdown | undefined, unknown]
  >([undefined, undefined]);

  const txParamsResult = useTxParams$UserMintKolourNft();
  const quoteResult = useQuoteKolourNft$Nft({
    kolours: selectedKolours.map((item) => item.kolour),
    address:
      walletStatus.status === "connected" ? walletStatus.info.address : "",
  });

  const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
    txParamsResult,
    quoteResult,
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
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Quoting kolours...");
      const { quotation, signature } = await httpGetQuoteKolourNft({
        kolours: selectedKolours.map((item) => item.kolour),
        address: walletStatus.info.address,
      }).catch((cause) => {
        throw DisplayableError.from(cause, "Failed to quote kolours");
      });

      setStatusBarText("Building transaction...");
      const buildTx$Params: BuildTxParams = {
        lucid: walletStatus.lucid,
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
      const { txId } = await httpPostMintKolourNftTx({
        txHex: txUserSigned.toString(),
        quotation,
        signature,
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
            <KolourGrid
              value={selectedKolours}
              onChange={(newValue: Layer[]) => {
                setSelectedKolours(newValue);
                if (newValue.length === 0) onCancel && onCancel();
              }}
            />
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Kolours", value: txBreakdown?.kolours },
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

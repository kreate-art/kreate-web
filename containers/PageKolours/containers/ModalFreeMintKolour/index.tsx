import { KolourQuotation } from "@kreate/protocol/schema/teiki/kolours";
import cx from "classnames";
import React from "react";

import IconSpin from "../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar/containers/ModalConnectWallet/components/ButtonConnectWallet/icons/IconSpin";
import ErrorBox from "../../../PageUpdateProjectV2/components/ErrorBox";

import FreeKolourGrid from "./container/FreeKolourGrid";
import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFee";
import { useQuoteFreeKolourNft$Nft } from "./hooks/useQuoteFreeKolourNft";
import styles from "./index.module.scss";
import { buildTx, BuildTxParams } from "./utils/transaction";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { tryUntil } from "@/modules/async-utils";
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import * as Kolours from "@/modules/kolours/types/Kolours";
import httpGetKoloursMintedByTxId from "@/modules/next-backend-client/api/httpGetKoloursMintedByTxId";
import { httpGetQuoteKolourNft } from "@/modules/next-backend-client/api/httpGetQuoteKolourNft";
import { httpPostMintKolourNftTx } from "@/modules/next-backend-client/api/httpPostMintKolourNftTx";
import { useTxParams$UserMintKolourNft } from "@/modules/next-backend-client/hooks/useTxParams$UserMintKolourNft";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  source: Kolours.KolourQuotationSource;
  kolours: Kolours.Kolour[];
  open: boolean;
  onCancel?: () => void;
  onSuccess?: (txHash: string, quotation: KolourQuotation) => void;
};

export default function ModalFreeMintKolour({
  className,
  style,
  source,
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
  const quoteResult = useQuoteFreeKolourNft$Nft({
    kolours: selectedKolours.map((item) => item),
    address:
      walletStatus.status === "connected" ? walletStatus.info.address : "",
    source,
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

  const waitUntilTxIndexed = async (txId: string) => {
    await tryUntil({
      run: () => httpGetKoloursMintedByTxId({ txId }),
      until: (response) => response.kolours.length > 0,
    });
  };
  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Quoting kolours...");
      const { quotation, signature } = await httpGetQuoteKolourNft({
        kolours: selectedKolours.map((item) => item),
        address: walletStatus.info.address,
        source,
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
      onSuccess && onSuccess(txId, quotation);
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
            <FreeKolourGrid
              value={selectedKolours}
              onChange={(newValue: Kolours.Kolour[]) => {
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
                { label: "Transaction Fee", value: txBreakdown?.transaction },
              ].concat(
                Object.keys(txBreakdown?.kolours ?? {}).map((key) => {
                  return {
                    label: `#${key}`,
                    value: txBreakdown?.kolours[key],
                  };
                })
              )}
              total={
                txBreakdown
                  ? sumTxBreakdown({
                      transaction: txBreakdown.transaction,
                      ...txBreakdown.kolours,
                    })
                  : undefined
              }
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
          content="Mint"
          disabled={txBreakdown === undefined || !lucid || busy}
          onClick={handleSubmit}
          color="primary"
        />
      </Modal.Actions>
    </Modal>
  );
}

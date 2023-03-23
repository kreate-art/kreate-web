import cx from "classnames";
import * as React from "react";

import ErrorBox from "../../../PageUpdateProjectV2/components/ErrorBox";

import { TxBreakdown, useEstimatedFees } from "./hooks/useEstimatedFees";
import IconRewardStar from "./icons/IconRewardStar";
import styles from "./index.module.scss";
import { buildTx, BuildTxParams } from "./utils/transaction";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { tryUntil } from "@/modules/async-utils";
import { sumTxBreakdown } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { Kolour } from "@/modules/kolours/types/Kolours";
import httpGetBackingActivitiesByTxHash from "@/modules/next-backend-client/api/httpGetBackingActivitiesByTxHash";
import { httpGetQuoteKolourNft } from "@/modules/next-backend-client/api/httpGetQuoteKolourNft";
import { httpPostMintKolourNftTx } from "@/modules/next-backend-client/api/httpPostMintKolourNftTx";
import { useTxParams$UserMintKolourNft } from "@/modules/next-backend-client/hooks/useTxParams$UserMintKolourNft";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
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
  kolours: Kolour[];
  open: boolean;
  onCancel?: () => void;
  onSuccess?: (event: SuccessEvent) => void;
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
  const lucid =
    walletStatus.status === "connected" ? walletStatus.lucid : undefined;
  const [[txBreakdown, txBreakdown$Error], setTxBreakdown] = React.useState<
    [TxBreakdown | undefined, unknown]
  >([undefined, undefined]);

  const txParamsResult = useTxParams$UserMintKolourNft();

  // const [txBreakdown$New, txBreakdown$New$Error] = useEstimatedFees({
  //   txParamsResult,
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
      run: () => httpGetBackingActivitiesByTxHash({ txHash }),
      until: (response) => response.activities.length > 0,
    });
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Quoting kolours...");
      const { quotation, signature } = await httpGetQuoteKolourNft({
        kolours,
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
    } catch (error) {
      const displayableError = DisplayableError.from(
        error,
        "Failed to back project"
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
          <Typography.Span content={`Mint Kolour NFT`} color="ink" />
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
              <Flex.Col padding="20px" gap="16px" className={styles.infoBox}>
                <Flex.Row
                  justifyContent="space-between"
                  gap="20px"
                  alignItems="center"
                >
                  <Flex.Col>
                    <IconRewardStar />
                  </Flex.Col>
                  <Typography.Div>
                    <Typography.Span
                      content="Welcome to Kreateverse"
                      size="bodySmall"
                    />
                  </Typography.Div>
                </Flex.Row>
                <Divider.Horizontal />
              </Flex.Col>
            </form>
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                { label: "Stake", value: txBreakdown?.back },
                { label: "Transaction Fee", value: txBreakdown?.transaction },
              ]}
              total={txBreakdown ? sumTxBreakdown(txBreakdown) : undefined}
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
              // loading={isTxBreakdownLoading}
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

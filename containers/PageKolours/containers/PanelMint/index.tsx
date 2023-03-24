import cx from "classnames";
import * as React from "react";

import ModalConnectWallet from "../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar/containers/ModalConnectWallet";
import ModalMintKolour from "../ModalMintKolour";
import ModalMintSuccess from "../ModalMintSuccess";

import Palette from "./components/Palette";
import Viewer from "./components/Viewer";
import IconChevronLeft from "./icons/IconChevronLeft";
import IconChevronRight from "./icons/IconChevronRight";
import styles from "./index.module.scss";
import { Selection } from "./types";

import { range } from "@/modules/array-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { Kolours } from "@/modules/kolours/types";
import { GenesisKreationStatus, Layer } from "@/modules/kolours/types/Kolours";
import { useModalPromises } from "@/modules/modal-promises";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";

type SuccessEvent = {
  txHash: string;
};

export type ModalMintKolour$SuccessEvent = SuccessEvent;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  initialImage: Kolours.Image | undefined;
  finalImage: Kolours.Image | undefined;
  palette: Kolours.Layer[] | undefined;
  fee: LovelaceAmount | undefined;
  listedFee: LovelaceAmount | undefined;
  status: GenesisKreationStatus | undefined;
  canGoPrev?: boolean;
  onGoPrev?: () => void;
  canGoNext?: boolean;
  onGoNext?: () => void;
};

export default function PanelMint({
  className,
  style,
  initialImage,
  finalImage,
  palette,
  fee,
  listedFee,
  status,
  canGoPrev,
  onGoPrev,
  canGoNext,
  onGoNext,
}: Props) {
  const [selection, setSelection] = React.useState<Selection>({});
  const { walletStatus } = useAppContextValue$Consumer();
  const { showModal } = useModalPromises();
  const { showMessage } = useToast();

  const handleClickButtonMint = async () => {
    switch (walletStatus.status) {
      case "disconnected":
        return void showModal<void>((resolve) => (
          <ModalConnectWallet
            open
            onCancel={() => resolve()}
            onSuccess={() => resolve()}
          />
        ));
      case "connected": {
        const kolours: Layer[] = [];
        if (!palette) return;
        for (const [index, selected] of Object.entries(selection)) {
          if (selected) kolours.push(palette[parseInt(index)]);
        }

        type ModalMintKolour$ModalResult =
          | { type: "success"; txHash: string }
          | { type: "cancel" };

        const modalMintKolour$ModalResult =
          await showModal<ModalMintKolour$ModalResult>((resolve) => (
            <ModalMintKolour
              open
              kolours={kolours}
              onCancel={() => resolve({ type: "cancel" })}
              onSuccess={(txHash) => resolve({ type: "success", txHash })}
            />
          ));
        if (modalMintKolour$ModalResult.type !== "success") return;
        await showModal<void>((resolve) => (
          <ModalMintSuccess
            open={true}
            onClose={resolve}
            txHash={modalMintKolour$ModalResult.txHash}
          />
        ));
        return;
      }
      default:
        return showMessage({ title: "Wallet is not ready.", color: "danger" });
    }
  };

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="16px" paddingBottom="32px">
        <div className={styles.viewerContainer}>
          <Viewer
            initialImage={initialImage}
            finalImage={finalImage}
            palette={palette}
            selectedIndexes={
              palette
                ? range(palette.length).filter(
                    (index) =>
                      palette[index].status !== "free" || !!selection[index]
                  )
                : undefined
            }
            fee={fee}
            listedFee={listedFee}
          />
          {canGoPrev ? (
            <button
              className={cx(styles.buttonNavigate, styles.buttonNavigateLeft)}
              onClick={onGoPrev}
            >
              <IconChevronLeft />
            </button>
          ) : null}
          {canGoNext ? (
            <button
              className={cx(styles.buttonNavigate, styles.buttonNavigateRight)}
              onClick={onGoNext}
            >
              <IconChevronRight />
            </button>
          ) : null}
        </div>
        <Palette
          className={styles.palette}
          palette={palette}
          selection={selection}
          onSelectionChange={setSelection}
        />
        <Divider$Horizontal$CustomDash />
        <Flex.Row justifyContent="center">
          <Button.Solid
            content="Mint"
            onClick={handleClickButtonMint}
            disabled={status === "minted"}
          />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}

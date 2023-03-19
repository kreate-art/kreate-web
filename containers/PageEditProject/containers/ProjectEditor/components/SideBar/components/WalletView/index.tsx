import cx from "classnames";
import * as React from "react";

import ModalConnectWallet from "../../../../../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar/containers/ModalConnectWallet";
import AddressView from "../AddressView";

import styles from "./index.module.scss";

import { formatUsdAmount } from "@/modules/bigint-utils";
import { useModalPromises } from "@/modules/modal-promises";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { LogoWallet } from "@/modules/teiki-logos";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import { WalletStatus } from "@/modules/wallet/types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  walletStatus: WalletStatus;
};

export default function WalletView({ className, style, walletStatus }: Props) {
  const { adaPriceInfo } = useAppContextValue$Consumer();
  const adaPriceInUsd = adaPriceInfo?.usd;
  const { showModal } = useModalPromises();

  switch (walletStatus.status) {
    case "unknown":
      return (
        <div className={cx(styles.container, className)} style={style}>
          <span className={styles.status}>&nbsp;</span>
        </div>
      );

    case "connecting":
      return (
        <div className={cx(styles.container, className)} style={style}>
          <span className={styles.status}>Connecting...</span>
        </div>
      );

    case "disconnected":
      return (
        <div className={cx(styles.container, className)} style={style}>
          <Button.Link
            content="Connect Wallet"
            style={{ color: "#fff" }}
            onClick={() =>
              showModal<void>((resolve) => (
                <ModalConnectWallet
                  open
                  onCancel={() => resolve()}
                  onSuccess={() => resolve()}
                />
              ))
            }
          />
        </div>
      );
  }

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.walletIdentity}>
        <LogoWallet
          className={styles.logoWallet}
          walletName={walletStatus.info.walletName}
        />
        <AddressView value={walletStatus.info.address} />
      </div>
      <Divider.Vertical color="white-10" style={{ margin: "4px 0" }} />
      <div className={styles.walletBalance}>
        <div className={styles.ada}>
          <AssetViewer.Ada.Standard
            as="span"
            lovelaceAmount={walletStatus.info.lovelaceAmount}
          />
        </div>
        <div className={styles.usd}>
          {adaPriceInUsd != null
            ? formatUsdAmount(
                {
                  lovelaceAmount: walletStatus.info.lovelaceAmount,
                  adaPriceInUsd,
                },
                {
                  includeAlmostEqualToSymbol: true,
                  includeCurrencySymbol: true,
                }
              )
            : null}
        </div>
      </div>
    </div>
  );
}

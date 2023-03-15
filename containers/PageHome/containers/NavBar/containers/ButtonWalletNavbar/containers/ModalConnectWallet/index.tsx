import cx from "classnames";
import * as React from "react";

import { NEXT_PUBLIC_NETWORK } from "../../../../../../../../config/client";

import ButtonConnectWallet from "./components/ButtonConnectWallet";
import IconClose from "./icons/IconClose";
import styles from "./index.module.scss";

import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import { LogoWallet } from "@/modules/teiki-logos";
import Modal from "@/modules/teiki-ui/components/Modal";
import { WalletStatus } from "@/modules/wallet/types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  onSuccess: (walletStatus: WalletStatus) => void;
  onCancel: () => void;
};

export default function ModalConnectWallet({
  className,
  style,
  open,
  onSuccess,
  onCancel,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { showMessage } = useToast();
  const isNetworkMainnet = NEXT_PUBLIC_NETWORK === "Mainnet";
  return (
    <Modal
      open={open}
      onOpenChange={(open) => !open && !!onCancel && onCancel()}
      className={cx(styles.modal, className)}
      closeOnEscape={!isLoading}
      closeOnDimmerClick={!isLoading}
      style={style}
    >
      <div className={styles.headingContainer}>
        <div className={styles.connectWalletHeading}>Connect Wallet</div>
        <button
          className={cx(
            styles.buttonCloseModal,
            isLoading ? styles.disabledCloseButton : null
          )}
          onClick={onCancel}
        >
          <IconClose />
        </button>
        {NEXT_PUBLIC_NETWORK === "Preview" ? (
          <span className={styles.networkWarning}>
            Cardano Preview Network Only
          </span>
        ) : null}
      </div>

      <div className={styles.buttonConnectWalletContainer}>
        <ButtonConnectWallet
          name="nami"
          label="Nami"
          isRecommended={true}
          logo={<LogoWallet className={styles.walletLogo} walletName="nami" />}
          installationUrl="https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo"
          onStartLoading={() => setIsLoading(true)}
          onStopLoading={() => setIsLoading(false)}
          onFailure={() =>
            showMessage({
              title: "Wallet connection has been cancelled",
              color: "danger",
            })
          }
          onSuccess={onSuccess}
          disabled={isLoading}
        />

        <ButtonConnectWallet
          name="flint"
          label="Flint"
          logo={<LogoWallet className={styles.walletLogo} walletName="flint" />}
          installationUrl="https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj"
          onStartLoading={() => setIsLoading(true)}
          onStopLoading={() => setIsLoading(false)}
          onFailure={() =>
            showMessage({
              title: "Wallet connection has been cancelled",
              color: "danger",
            })
          }
          onSuccess={onSuccess}
          disabled={isLoading}
        />

        <ButtonConnectWallet
          name="eternl"
          label="Eternl"
          logo={
            <LogoWallet className={styles.walletLogo} walletName="eternl" />
          }
          installationUrl="https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka"
          onStartLoading={() => setIsLoading(true)}
          onStopLoading={() => setIsLoading(false)}
          onFailure={() =>
            showMessage({
              title: "Wallet connection has been cancelled",
              color: "danger",
            })
          }
          onSuccess={onSuccess}
          disabled={isLoading}
        />

        <ButtonConnectWallet
          name="gerowallet"
          label="Gero Wallet"
          logo={
            <LogoWallet className={styles.walletLogo} walletName="gerowallet" />
          }
          installationUrl={
            isNetworkMainnet
              ? "https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe"
              : "https://chrome.google.com/webstore/detail/gerowallet-preview/iifeegfcfhlhhnilhfoeihllenamcfgc"
          }
          onStartLoading={() => setIsLoading(true)}
          onStopLoading={() => setIsLoading(false)}
          onFailure={() =>
            showMessage({
              title: "Wallet connection has been cancelled",
              color: "danger",
            })
          }
          onSuccess={onSuccess}
          disabled={isLoading}
        />

        {/* {isNetworkMainnet ? (
        <ButtonConnectWallet
          name="cardwallet"
          label="Card Wallet"
          logo={
            <LogoWallet className={styles.walletLogo} walletName="cardwallet" />
          }
          installationUrl="https://chrome.google.com/webstore/detail/cwallet/apnehcjmnengpnmccpaibjmhhoadaico"
          onStartLoading={() => setIsLoading(true)}
          onStopLoading={() => setIsLoading(false)}
          onFailure={() =>
            showMessage({
              title: "Wallet connection has been cancelled",
              color: "danger",
            })
          }
          onSuccess={onSuccess}
          disabled={isLoading}
        />
      ) : null} */}

        {/* {isNetworkMainnet ? (
          <ButtonConnectWallet
            name="nufi"
            label="NuFi"
            logo={
              <LogoWallet className={styles.walletLogo} walletName="nufi" />
            }
            installationUrl="https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca"
            onStartLoading={() => setIsLoading(true)}
            onStopLoading={() => setIsLoading(false)}
            onFailure={() =>
              showMessage({
                title: "Wallet connection has been cancelled",
                color: "danger",
              })
            }
            onSuccess={onSuccess}
            disabled={isLoading}
          />
        ) : null} */}

        {/* {isNetworkMainnet ? (
        <ButtonConnectWallet
          name="typhoncip30"
          label="Typhon"
          logo={
            <LogoWallet
              className={styles.walletLogo}
              walletName="typhoncip30"
            />
          }
          installationUrl="https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh"
          onStartLoading={() => setIsLoading(true)}
          onStopLoading={() => setIsLoading(false)}
          onFailure={() =>
            showMessage({
              title: "Wallet connection has been cancelled",
              color: "danger",
            })
          }
          onSuccess={onSuccess}
          disabled={isLoading}
        />
      ) : null} */}
      </div>
    </Modal>
  );
}

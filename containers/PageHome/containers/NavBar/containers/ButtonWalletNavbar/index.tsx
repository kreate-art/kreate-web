import * as React from "react";

import { NEXT_PUBLIC_ENABLE_LEGACY } from "../../../../../../config/client";
import IconAddressCard from "../../icons/IconAddressCard";

import ButtonWalletOptions from "./containers/ButtonWalletOptions";
import ModalConnectWallet from "./containers/ModalConnectWallet";
import ModalMigrateFromLegacy from "./containers/ModalMigrateFromLegacy";
import styles from "./index.module.scss";

import { useModalPromises } from "@/modules/modal-promises";
import { httpGetLegacyBacking } from "@/modules/next-backend-client/api/httpGetLegacyBacking";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import { WalletStatus } from "@/modules/wallet/types";

export default function ButtonWalletNavbar() {
  const appContextValue = useAppContextValue$Consumer();
  const modalPromises = useModalPromises();

  switch (appContextValue.walletStatus.status) {
    case "unknown":
      return appContextValue.lastSavedWalletInfo ? (
        <ButtonWalletOptions
          onDisconnect={appContextValue.disconnectWallet}
          walletInfo={appContextValue.lastSavedWalletInfo}
          disabled
        />
      ) : (
        <Button.Outline
          icon={<IconAddressCard />}
          content="Loading Wallet..."
          size="medium"
          disabled={true}
        />
      );
    case "disconnected":
      return (
        <Button.Outline
          icon={<IconAddressCard />}
          content="Connect Wallet"
          size="medium"
          className={styles.btnConnectWallet}
          onClick={async () => {
            const modalResult = await modalPromises.showModal<WalletStatus>(
              (resolve, _reject) => (
                <ModalConnectWallet
                  open={true}
                  onCancel={() => resolve({ status: "disconnected" })}
                  onSuccess={(walletStatus) => resolve(walletStatus)}
                />
              )
            );

            if (
              modalResult.status !== "connected" ||
              NEXT_PUBLIC_ENABLE_LEGACY !== "true"
            )
              return;

            try {
              const httpGetLegacyBacking$Response = await httpGetLegacyBacking({
                backerAddress: modalResult.info.address,
              });
              if (
                httpGetLegacyBacking$Response.error === undefined &&
                httpGetLegacyBacking$Response.backingInfo.length > 0
              ) {
                await modalPromises.showModal<void>((resolve) => (
                  <ModalMigrateFromLegacy open onClose={() => resolve()} />
                ));
              }
            } catch (error) {
              // we intentionally ignore errors
              console.error(error);
            }
          }}
        />
      );
    case "connecting":
      return appContextValue.lastSavedWalletInfo ? (
        <ButtonWalletOptions
          onDisconnect={appContextValue.disconnectWallet}
          walletInfo={appContextValue.lastSavedWalletInfo}
          disabled
        />
      ) : (
        <Button.Outline
          icon={<IconAddressCard />}
          content="Connecting..."
          size="medium"
          disabled={true}
        />
      );
    case "connected":
      return (
        <ButtonWalletOptions
          onDisconnect={appContextValue.disconnectWallet}
          walletInfo={appContextValue.walletStatus.info}
          disabled={false}
        />
      );
  }
}

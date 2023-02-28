import { Network, Provider } from "lucid-cardano";
import * as React from "react";

import { AdaPriceInfo, useAdaPriceInfo } from "@/modules/ada-price-provider";
import { assert } from "@/modules/common-utils";
import { useLastSavedWalletInfo } from "@/modules/wallet/hooks/useLastSavedWalletInfo";
import { useWalletConnection } from "@/modules/wallet/hooks/useWalletConnection";
import {
  useWalletNetworkWarning,
  UseWalletNetworkWarning$Result,
} from "@/modules/wallet/hooks/useWalletNetworkWarning";
import { WalletInfo, WalletStatus } from "@/modules/wallet/types";

const WALLET_REFRESH_INTERVAL = 5000;

export type AppContextValue = {
  walletStatus: WalletStatus;
  connectWallet: (walletName: string) => Promise<WalletStatus>;
  disconnectWallet: () => void;
  lastSavedWalletInfo: WalletInfo | null;
  walletNetworkWarning: UseWalletNetworkWarning$Result | undefined;
  adaPriceInfo: AdaPriceInfo | undefined;
};

function error<T>(message: string): T {
  throw new Error(message);
}

export const AppContext = React.createContext<AppContextValue>({
  walletStatus: { status: "unknown" },
  connectWallet: () => error("app context not injected"),
  disconnectWallet: () => error("app context not injected"),
  lastSavedWalletInfo: null,
  walletNetworkWarning: undefined,
  adaPriceInfo: undefined,
});

export function useAppContextValue$Provider({
  provider,
  network,
}: {
  provider: Provider;
  network: Network;
}): AppContextValue {
  const {
    walletStatus,
    connectWallet,
    disconnectWallet,
    isWalletConnected,
    refreshWallet,
  } = useWalletConnection({ provider, network });

  const lastSavedWalletInfo = useLastSavedWalletInfo(walletStatus);

  const walletNetworkWarning = useWalletNetworkWarning(walletStatus);

  React.useEffect(() => {
    // When `status` is `"unknown"` (usually when the components are newly
    // mounted), we try to recover the wallet state.
    if (walletStatus.status !== "unknown") return;
    if (lastSavedWalletInfo === "unknown") return;

    void (async () => {
      try {
        assert(lastSavedWalletInfo, "no saved wallet info");
        const { walletName } = lastSavedWalletInfo;
        const canRecover = await isWalletConnected(walletName);
        assert(canRecover, "cannot recover without prompt");
        await connectWallet(walletName);
      } catch (error) {
        console.warn(error); // in case of failure, we ignore the error
        disconnectWallet();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletStatus.status, lastSavedWalletInfo]);

  React.useEffect(() => {
    if (walletStatus.status !== "connected") return;
    const timerId = setInterval(() => refreshWallet(), WALLET_REFRESH_INTERVAL);
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletStatus.status]);

  const adaPriceInfo = useAdaPriceInfo();

  return {
    walletStatus,
    connectWallet,
    disconnectWallet,
    lastSavedWalletInfo:
      lastSavedWalletInfo === "unknown" ? null : lastSavedWalletInfo,
    walletNetworkWarning,
    adaPriceInfo,
  };
}

export function useAppContextValue$Consumer() {
  return React.useContext(AppContext);
}

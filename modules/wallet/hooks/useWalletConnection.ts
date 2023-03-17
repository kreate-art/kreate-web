import { del, set } from "idb-keyval";
import { Lucid, Network, Provider } from "lucid-cardano";
import * as React from "react";

import { WalletStatus } from "../types";
import * as ConnectionUtils from "../utils/connection";
import { loadSavedAuthInfo } from "../utils/storage";

import * as Auth from "@/modules/authorization";
import { assert } from "@/modules/common-utils";

type Params = {
  provider: Provider;
  network: Network;
};

type Results = {
  walletStatus: WalletStatus;
  connectWallet: (walletName: string) => Promise<WalletStatus>;
  disconnectWallet: () => void;
  isWalletConnected: (walletName: string) => Promise<boolean>;
  refreshWallet: () => Promise<void>;
};

export function useWalletConnection({ provider, network }: Params): Results {
  const [walletStatus, setWalletStatus] = React.useState<WalletStatus>(() => ({
    status: "unknown",
  }));

  const authenticate = async (lucid: Lucid): Promise<Auth.AuthHeader> => {
    const savedAuthInfo = await Auth.sign(lucid);
    const address = await lucid.wallet.address();
    const authHeader: Auth.AuthHeader = {
      address,
      header: Auth.constructHeader({
        savedAuthInfo,
        address,
      }),
    };
    set(Auth.getStorageKey(), savedAuthInfo);
    return authHeader;
  };

  const connectWallet = async (walletName: string): Promise<WalletStatus> => {
    assert(walletStatus.status !== "connecting", "already connecting");
    try {
      setWalletStatus({ status: "connecting", walletName });
      const [info, lucid] = await ConnectionUtils.connectWallet(walletName, {
        provider,
        network,
      });
      const authHeader = await authenticate(lucid);
      setWalletStatus({ status: "connected", info, lucid, authHeader });
      return { status: "connected", info, lucid, authHeader };
    } catch (error) {
      setWalletStatus({ status: "disconnected" });
      throw error;
    }
  };

  const disconnectWallet = () => {
    setWalletStatus({ status: "disconnected" });
    del(Auth.getStorageKey());
  };

  const isWalletConnected = async (walletName: string) => {
    try {
      const wallet = window?.cardano?.[walletName];
      assert(wallet, "wallet undefined");
      return await wallet.isEnabled();
    } catch {
      return false;
    }
  };

  const refreshWallet = async () => {
    if (walletStatus.status !== "connected") return;
    try {
      const connected = await isWalletConnected(walletStatus.info.walletName);
      assert(connected, "wallet not connected");

      const savedAuthInfo = await loadSavedAuthInfo();
      assert(
        savedAuthInfo != null && savedAuthInfo.expiration > Date.now() / 1_000,
        "wallet not authenticated"
      );
      const walletInfo = await ConnectionUtils.getWalletInfo(
        walletStatus.info.walletName,
        walletStatus.lucid
      );
      setWalletStatus((obj) => ({ ...obj, info: walletInfo }));
    } catch (error) {
      setWalletStatus({ status: "disconnected" });
    }
  };

  return {
    walletStatus,
    connectWallet,
    disconnectWallet,
    isWalletConnected,
    refreshWallet,
  };
}

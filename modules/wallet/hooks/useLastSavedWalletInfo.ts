import * as React from "react";

import { WalletInfo, WalletStatus } from "../types";
import { loadWalletInfo, saveWalletInfo } from "../utils/storage";

const STORAGE_KEY = "lastSavedWalletInfoNew";

/**
 * Automaticaly saves the wallet info to `localStorage`,
 * and returns the last saved wallet info.
 *
 * Useful to display UI when `walletStatus.status === "unknown"`.
 *
 * TODO: __@sk-kitsune__: we should make the return type clearer
 */
export function useLastSavedWalletInfo(
  walletStatus: WalletStatus
): WalletInfo | null | "unknown" {
  const [lastSavedWalletInfo, setLastSavedWalletInfo] = React.useState<
    WalletInfo | null | "unknown"
  >("unknown");

  React.useEffect(() => {
    const walletInfo = loadWalletInfo(STORAGE_KEY);
    setLastSavedWalletInfo(walletInfo);
  }, []);

  const walletInfo =
    walletStatus.status === "connected" ? walletStatus.info : null;

  React.useEffect(() => {
    if (walletStatus.status === "unknown") return;
    if (walletStatus.status === "connecting") return;
    saveWalletInfo(STORAGE_KEY, walletInfo);
    setLastSavedWalletInfo(walletInfo);
  }, [walletInfo, walletStatus.status]);

  return lastSavedWalletInfo;
}

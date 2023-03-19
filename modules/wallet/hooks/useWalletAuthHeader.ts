import { set, del } from "idb-keyval";
import * as React from "react";

import { WalletStatus } from "../types";
import { loadSavedAuthInfo } from "../utils/storage";

import * as Auth from "@/modules/authorization";
import { isAbortError } from "@/modules/common-hooks/hooks/useAsyncComputation";
import { assert } from "@/modules/common-utils";

/**
 * Automaticaly saves the wallet authorization token to `localStorage`,
 * and returns the wallet authorization token.
 *
 */

export type WalletAuthHeaderInfo =
  | { status: "authenticated"; info: Auth.AuthHeader }
  | { status: "unauthenticated" }
  | { status: "not-ready" };

type Results = {
  walletAuthHeaderInfo: WalletAuthHeaderInfo;
  authenticateWallet: () => Promise<WalletAuthHeaderInfo>;
};

export function useWalletAuthHeader(walletStatus: WalletStatus): Results {
  const [headerInfo, setHeaderInfo] = React.useState<WalletAuthHeaderInfo>({
    status: "not-ready",
  });
  const [isAuthenticating, setIsAuthenticating] =
    React.useState<boolean>(false);
  // TODO: Abort?
  const authenticateWallet = async (): Promise<WalletAuthHeaderInfo> => {
    assert(walletStatus.status === "connected", "wallet is not connected");
    const savedAuthInfo = await Auth.sign(walletStatus.lucid);
    const address = walletStatus.info.address;
    const headerInfo: WalletAuthHeaderInfo = {
      status: "authenticated",
      info: {
        address,
        header: Auth.constructHeader({
          savedAuthInfo,
          address,
        }),
      },
    };
    set(Auth.getStorageKey(), savedAuthInfo);
    setHeaderInfo(headerInfo);
    return headerInfo;
  };

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    void (async () => {
      if (walletStatus.status !== "connected") {
        setHeaderInfo({ status: "not-ready" });
        return;
      }
      try {
        // TODO: Should look up using address. And
        let savedAuthInfo = await loadSavedAuthInfo();
        signal.throwIfAborted();
        assert(savedAuthInfo != null, "Not found saved authorization info");
        const { version, expiration } = savedAuthInfo;
        assert(
          version === Auth.VERSION &&
            expiration > Math.trunc(Date.now()) / 1_000,
          "invalid stored wallet auth token"
        );
        const address = walletStatus.info.address;
        if (
          headerInfo.status === "authenticated" &&
          headerInfo.info.address !== address &&
          !isAuthenticating
        ) {
          setIsAuthenticating(true);
          savedAuthInfo = await Auth.sign(walletStatus.lucid);
          set(Auth.getStorageKey(), savedAuthInfo);
        } else {
          setIsAuthenticating(false);
        }
        // TODO: Should return the whole header string instead
        setHeaderInfo({
          status: "authenticated",
          info: {
            address,
            header: Auth.constructHeader({
              savedAuthInfo,
              address,
            }),
          },
        });
      } catch (error) {
        if (isAbortError(error)) return;
        await del(Auth.getStorageKey());
        setHeaderInfo({ status: "unauthenticated" });
      }
    })();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletStatus]);

  return { walletAuthHeaderInfo: headerInfo, authenticateWallet };
}

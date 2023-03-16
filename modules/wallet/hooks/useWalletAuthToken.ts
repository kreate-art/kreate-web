import { get, set, del } from "idb-keyval";
import * as React from "react";

import { WalletStatus } from "../types";

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
        const savedAuthInfo = (await get(
          Auth.getStorageKey()
        )) as Auth.SavedAuthInfo;
        signal.throwIfAborted();
        const { version, expiration } = savedAuthInfo;
        assert(
          version === Auth.VERSION &&
            expiration > Math.trunc(Date.now()) / 1_000,
          "invalid stored wallet auth token"
        );
        const address = walletStatus.info.address;
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
        console.warn(error);
        await del(Auth.getStorageKey());
        setHeaderInfo({ status: "unauthenticated" });
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [walletStatus]);

  return { walletAuthHeaderInfo: headerInfo, authenticateWallet };
}

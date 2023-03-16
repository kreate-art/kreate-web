import { get, set, del } from "idb-keyval";
import * as React from "react";

import { WalletStatus } from "../types";

import * as Auth from "@/modules/authorization";
import { toExpirationTime } from "@/modules/authorization";
import { isAbortError } from "@/modules/common-hooks/hooks/useAsyncComputation";
import { assert } from "@/modules/common-utils";

/**
 * Automaticaly saves the wallet authorization token to `localStorage`,
 * and returns the wallet authorization token.
 *
 */

export type WalletAuthHeaderInfo =
  | { status: "authenticated"; info: Auth.AuthInfo }
  | { status: "unauthenticated" }
  | { status: "not-ready" };

type Results = {
  walletAuthHeaderInfo: WalletAuthHeaderInfo;
  authenticateWallet: () => Promise<WalletAuthHeaderInfo>;
};

export function useWalletAuthHeader(walletStatus: WalletStatus): Results {
  const [tokenInfo, setTokenInfo] = React.useState<WalletAuthHeaderInfo>({
    status: "not-ready",
  });
  // TODO: Abort?
  const authenticateWallet = async (): Promise<WalletAuthHeaderInfo> => {
    assert(walletStatus.status === "connected", "wallet is not connected");
    const token = await Auth.sign(walletStatus.lucid);
    const address = walletStatus.info.address;
    const tokenInfo: WalletAuthHeaderInfo = {
      status: "authenticated",
      info: {
        address,
        header: Auth.constructAuthHeader({
          token,
          address,
        }),
      },
    };
    set(Auth.getStorageKey(), token);
    setTokenInfo(tokenInfo);
    return tokenInfo;
  };

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    void (async () => {
      if (walletStatus.status !== "connected") {
        setTokenInfo({ status: "not-ready" });
        return;
      }
      try {
        // TODO: Should look up using address. And
        const token = (await get(Auth.getStorageKey())) as Auth.AuthToken;
        signal.throwIfAborted();
        const { version, expiration } = JSON.parse(token.payload);
        assert(
          version === Auth.VERSION && expiration > toExpirationTime(Date.now()),
          "invalid stored wallet auth token"
        );
        const address = walletStatus.info.address;
        // TODO: Should return the whole header string instead
        setTokenInfo({
          status: "authenticated",
          info: {
            address,
            header: Auth.constructAuthHeader({
              token,
              address,
            }),
          },
        });
      } catch (error) {
        if (isAbortError(error)) return;
        console.error(error);
        await del(Auth.getStorageKey());
        setTokenInfo({ status: "unauthenticated" });
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [walletStatus]);

  return { walletAuthHeaderInfo: tokenInfo, authenticateWallet };
}

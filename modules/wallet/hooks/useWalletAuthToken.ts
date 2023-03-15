import { toText } from "lucid-cardano";
import * as React from "react";

import { WalletStatus } from "../types";

import * as Auth from "@/modules/authorization";
import { toExpirationTime } from "@/modules/authorization";
import { isAbortError } from "@/modules/common-hooks/hooks/useAsyncComputation";
import { assert } from "@/modules/common-utils";
import { clear, load, save } from "@/modules/storage-v2";
import { pure } from "@/modules/with-bufs-as";

/**
 * Automaticaly saves the wallet authorization token to `localStorage`,
 * and returns the wallet authorization token.
 *
 */

export type WalletAuthHeaderInfo =
  | { status: "authenticated"; authHeader: string }
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
    const tokenInfo: WalletAuthHeaderInfo = {
      status: "authenticated",
      authHeader: Auth.constructAuthHeader({
        token,
        address: walletStatus.info.address,
      }),
    };
    save(Auth.getStorageKey(), pure(token));
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
        const token = (await load(Auth.getStorageKey())).data as Auth.AuthToken;
        signal.throwIfAborted();
        const { version, expiration } = JSON.parse(toText(token.payload));
        assert(
          version === Auth.VERSION && expiration > toExpirationTime(Date.now()),
          "invalid stored wallet auth token"
        );
        // TODO: Should return the whole header string instead
        setTokenInfo({
          status: "authenticated",
          authHeader: Auth.constructAuthHeader({
            token,
            address: walletStatus.info.address,
          }),
        });
      } catch (error) {
        if (isAbortError(error)) return;
        clear(Auth.getStorageKey());
        setTokenInfo({ status: "unauthenticated" });
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [walletStatus]);

  return { walletAuthHeaderInfo: tokenInfo, authenticateWallet };
}

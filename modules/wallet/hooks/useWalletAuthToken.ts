/* eslint-disable react-hooks/exhaustive-deps */
import { toText } from "lucid-cardano";
import * as React from "react";

import { WalletStatus } from "../types";

import * as Auth from "@/modules/authorization";
import { toExpirationTime } from "@/modules/authorization";
import { clear, load, save } from "@/modules/storage-v2";
import { pure } from "@/modules/with-bufs-as";

/**
 * Automaticaly saves the wallet authorization token to `localStorage`,
 * and returns the wallet authorization token.
 *
 */
export function useWalletAuthToken(
  walletStatus: WalletStatus
): Auth.AuthToken | null | "unknown" {
  const [authToken, setAuthToken] = React.useState<
    Auth.AuthToken | null | "unknown"
  >("unknown");

  React.useEffect(() => {
    if (walletStatus.status !== "connected") return;
    void (async () => {
      try {
        const token = (await load(Auth.getStorageKey())).data as Auth.AuthToken;
        const { version, expiration } = JSON.parse(toText(token.payload));
        if (expiration < toExpirationTime(Date.now()))
          throw new Error("Authored token expired");
        if (version !== Auth.VERSION) {
          clear(Auth.getStorageKey());
          throw new Error("Deprecated token");
        }
        setAuthToken(token);
      } catch (error) {
        console.warn(error);
        const token = await Auth.sign(walletStatus.lucid);
        save(Auth.getStorageKey(), pure(token));
        setAuthToken(token);
      }
    })();
  }, [walletStatus.status]);

  return authToken;
}

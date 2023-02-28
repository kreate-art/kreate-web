import { networkToId } from "lucid-cardano";

import { WalletStatus } from "../types";

import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { toJson } from "@/modules/json-utils";

type Result = null | "wrong-network" | "maybe-wrong-network";

export type UseWalletNetworkWarning$Result = Result;

/**
 * Given a `WalletStatus`, checks if user has chosen the correct network.
 *
 * Algorithm:
 * - Check if network id in the wallet matches the network id of lucid.
 *   - In case of mismatch, return `"wrong-network"`.
 * - Let `utxos` be the list of all the utxos in the wallet.
 * - If `utxos` is empty:
 *   - Query Blockfrost to check if the address has utxos.
 *   - If yes, return `"maybe-wrong-network"`, otherwise, return `null`.
 * - Initialize `numSuccess = 0` and `numFailure = 0`.
 * - Loop forever:
 *   - Pick a random `utxo` in `utxos`
 *   - Query blockfrost to check if the UTXO exists
 *   - If succeeds, `numSuccess++`, otherwise, `numFailure++`
 *   - If `numSuccess` or `numFailure` reaches 2, break the loop.
 * - If `numFailure > numSuccess`, return `"maybe-wrong-network"`
 * - Otherwise, return `null`.
 */
export function useWalletNetworkWarning(
  walletStatus: WalletStatus | undefined
): Result | undefined {
  const [result, reason] = useMemo$Async<Result>(
    async (signal) => {
      if (!walletStatus || walletStatus.status !== "connected") {
        return undefined;
      }

      const { lucid, info } = walletStatus;

      if (info.addressDetails.networkId !== networkToId(lucid.network)) {
        return "wrong-network";
      }

      if (lucid.network === "Mainnet") {
        // There's nothing ambiguous about mainnet
        return null;
      }

      const utxos = await lucid.wallet.getUtxos();
      signal.throwIfAborted();

      if (!utxos.length) {
        // When the wallet is empty, it's hard to check the actual connected network
        // Also don't use `lucid.utxosAt` since it uses the Lucid's not the wallet's one.
        return undefined;
      }

      let numSuccess = 0;
      let numFailure = 0;

      while (numSuccess < 2 && numFailure < 2) {
        const randomIndex = Math.floor(Math.random() * utxos.length);
        const utxo = utxos[randomIndex];
        const response = await lucid.utxosByOutRef([
          { txHash: utxo.txHash, outputIndex: utxo.outputIndex },
        ]);
        signal.throwIfAborted();

        if (response.length) {
          numSuccess += 1;
        } else {
          numFailure += 1;
        }
      }

      return numFailure > numSuccess ? "maybe-wrong-network" : null;
    },
    { debouncedDelay: 1000 },
    [
      walletStatus?.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus?.status,
    ]
  );

  if (reason) {
    return undefined;
  } else {
    return result;
  }
}

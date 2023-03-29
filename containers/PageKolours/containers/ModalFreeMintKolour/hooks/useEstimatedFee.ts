import { buildTxRaw } from "../../ModalMintKolour/utils/transaction";

import { UseQuoteFreeKolourNft$Result } from "./useQuoteFreeKolourNft";

import { try$, throw$ } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { Kolour } from "@/modules/kolours/types/Kolours";
import { UseTxParams$UserMintKolourNft$Result } from "@/modules/next-backend-client/hooks/useTxParams$UserMintKolourNft";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  txParamsResult?: UseTxParams$UserMintKolourNft$Result;
  quoteResult?: UseQuoteFreeKolourNft$Result;
  disabled?: boolean;
};

export type TxBreakdown = {
  transaction: LovelaceAmount;
  kolours: Record<Kolour, LovelaceAmount>;
};

export function useEstimatedFees({
  txParamsResult,
  quoteResult,
  disabled,
}: Params): [TxBreakdown | undefined, unknown] {
  const { walletStatus } = useAppContextValue$Consumer();

  return useMemo$Async<TxBreakdown>(
    async (signal) => {
      if (!txParamsResult || !quoteResult || disabled) return undefined;

      switch (walletStatus.status) {
        case "connected":
          break;
        case "disconnected":
          throw new DisplayableError({
            title: "Wallet is not connected",
            description: "Please connect your wallet.",
          });
        case "unknown":
          return undefined;
        case "connecting":
          return undefined;
      }

      DisplayableError.assert(!txParamsResult.error, {
        title: "Failed to build transaction",
        cause: txParamsResult,
      });

      DisplayableError.assert(!quoteResult.error, {
        title: "Failed to build transaction",
        cause: quoteResult,
      });

      const tx = await buildTxRaw({
        lucid: walletStatus.lucid,
        quotation: quoteResult.data.quotation,
        txParams: txParamsResult.data.txParams,
      });

      signal.throwIfAborted();

      const txComplete = await try$(
        async () => tx.complete(),
        (cause) =>
          throw$(
            new DisplayableError({
              title: "Transaction build failed",
              cause,
            })
          )
      );

      signal.throwIfAborted();

      const allKolours = quoteResult.data.quotation.kolours;
      const allKoloursWithFee: Record<Kolour, LovelaceAmount> = {};
      for (const key in allKolours)
        allKoloursWithFee[key] = allKolours[key].fee;
      return {
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
        kolours: allKoloursWithFee,
      };
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
      disabled,
      txParamsResult?.error,
      quoteResult?.error,
    ]
  );
}

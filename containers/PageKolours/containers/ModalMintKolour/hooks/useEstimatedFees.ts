import { buildTxRaw } from "../utils/transaction";

import { UseQuoteKolourNft$Result } from "./useQuoteKolourNft";

import { try$, throw$ } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { UseTxParams$UserMintKolourNft$Result } from "@/modules/next-backend-client/hooks/useTxParams$UserMintKolourNft";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  txParamsResult?: UseTxParams$UserMintKolourNft$Result;
  quoteResult?: UseQuoteKolourNft$Result;
  disabled?: boolean;
};

export type TxBreakdown = {
  kolours: LovelaceAmount;
  ikoDiscount: LovelaceAmount;
  sspoDiscount: LovelaceAmount;
  transaction: LovelaceAmount;
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
        title: "Transaction parameters invalid",
        cause: txParamsResult,
      });

      DisplayableError.assert(!quoteResult.error, {
        title: "Transaction parameters invalid",
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
      let koloursFee = BigInt(0);
      let koloursListedFee = BigInt(0);
      for (const key in allKolours) {
        koloursFee += BigInt(allKolours[key].fee);
        koloursListedFee += BigInt(allKolours[key].listedFee);
      }

      return {
        kolours: koloursListedFee,
        ikoDiscount: -koloursListedFee / BigInt(2),
        sspoDiscount: -(
          (koloursListedFee - koloursFee * BigInt(2)) /
          BigInt(2)
        ),
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
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

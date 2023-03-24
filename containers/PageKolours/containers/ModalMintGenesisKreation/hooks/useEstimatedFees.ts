import { buildTxRaw } from "../utils/transaction";

import { UseQuoteGKNft$Result } from "./useQuoteGKNft$Nft";

import { try$, throw$ } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { UseTxParams$UserMintGKNft$Result } from "@/modules/next-backend-client/hooks/useTxParams$UserMintGKNft";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  txParamsResult?: UseTxParams$UserMintGKNft$Result;
  quoteResult?: UseQuoteGKNft$Result;
  name: string;
  description: string;
  disabled?: boolean;
};

export type TxBreakdown = {
  genesisKreation: LovelaceAmount;
  ikoDiscount: LovelaceAmount;
  sspoDiscount: LovelaceAmount;
  transaction: LovelaceAmount;
};

export function useEstimatedFees({
  txParamsResult,
  quoteResult,
  name,
  description,
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

      DisplayableError.assert(name, {
        title: "Missing Genesis Kreation NFT name",
        cause: txParamsResult,
      });

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
        name,
        description,
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

      const genesisKreationListedFee = quoteResult.data.quotation.listedFee;
      const genesisKreationFee = quoteResult.data.quotation.fee;

      return {
        genesisKreation: -genesisKreationListedFee,
        ikoDiscount: BigInt(genesisKreationListedFee) / BigInt(2),
        sspoDiscount:
          (BigInt(genesisKreationListedFee) -
            BigInt(genesisKreationFee) * BigInt(2)) /
          BigInt(2),
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
      name,
      description,
    ]
  );
}

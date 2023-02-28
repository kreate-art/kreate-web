import { buildTxRaw } from "../utils/transactions";

import { throw$, try$ } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { UseTxParams$CreatorCreateProject$Result } from "@/modules/next-backend-client/hooks/useTxParams$CreatorCreateProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  txParamsResult?: UseTxParams$CreatorCreateProject$Result;
  sponsorshipAmount?: LovelaceAmount;
  disabled?: boolean;
};

export type TxBreakdown = {
  pledge: LovelaceAmount;
  creation: LovelaceAmount;
  sponsor: LovelaceAmount;
  transaction: LovelaceAmount;
};

export function useEstimatedFees({
  txParamsResult,
  sponsorshipAmount,
  disabled,
}: Params): [TxBreakdown | undefined, unknown] {
  const { walletStatus } = useAppContextValue$Consumer();

  return useMemo$Async<TxBreakdown>(
    async (signal) => {
      if (!txParamsResult || disabled || sponsorshipAmount === undefined)
        return undefined;

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

      const { tx } = await buildTxRaw({
        lucid: walletStatus.lucid,
        informationCid: "Qm00000000000000000000000000000000000000000000",
        ownerAddress: walletStatus.info.address,
        sponsorshipAmount: sponsorshipAmount ?? BigInt(0),
        protocolParamsUtxo: txParamsResult.data.protocolParamsUtxo,
        projectAtScriptReferenceUtxo:
          txParamsResult.data.projectAtScriptReferenceUtxo,
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

      const { protocolParams } = txParamsResult.computed;

      return {
        pledge: -protocolParams.projectPledge,
        creation: -protocolParams.projectCreationFee,
        sponsor: -(sponsorshipAmount ?? 0),
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
      };
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
      sponsorshipAmount,
      disabled,
      txParamsResult?.error,
    ]
  );
}

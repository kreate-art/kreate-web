import { buildTxRaw } from "../utils/transaction";

import { try$, throw$ } from "@/modules/async-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount, ProjectBenefitsTier } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { UseTxParams$BackerBackProject$Result } from "@/modules/next-backend-client/hooks/useTxParams$BackerBackProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  txParamsResult?: UseTxParams$BackerBackProject$Result;
  projectId: string;
  projectTiers: (ProjectBenefitsTier & { activeMemberCount?: number })[];
  lovelaceAmount?: LovelaceAmount;
  stakingAmount: LovelaceAmount;
  message?: string;
  disabled?: boolean;
};

export type TxBreakdown = {
  back: LovelaceAmount;
  transaction: LovelaceAmount;
};

export function useEstimatedFees({
  txParamsResult,
  projectId,
  projectTiers,
  lovelaceAmount,
  stakingAmount,
  message,
  disabled,
}: Params): [TxBreakdown | undefined, unknown] {
  const { walletStatus } = useAppContextValue$Consumer();

  return useMemo$Async<TxBreakdown>(
    async (signal) => {
      if (
        !txParamsResult ||
        lovelaceAmount === undefined ||
        message === undefined ||
        disabled
      )
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

      const currentTier = amountToTier(stakingAmount, projectTiers);
      const newTier = amountToTier(
        sumLovelaceAmount([stakingAmount, lovelaceAmount]),
        projectTiers
      );

      // TODO: Temporary error to prevent users from entering
      // a fully filled member tier.
      DisplayableError.assert(
        newTier == null ||
          newTier.maximumMembers == null ||
          newTier === currentTier ||
          (newTier.activeMemberCount ?? 0) < newTier.maximumMembers,
        { title: "Failed" }
      );

      const tx = await buildTxRaw({
        lucid: walletStatus.lucid,
        lovelaceAmount,
        message,
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

      return {
        back: -lovelaceAmount,
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
      };
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
      projectId,
      lovelaceAmount,
      message,
      disabled,
    ]
  );
}

function amountToTier(
  amount: LovelaceAmount,
  tiers: (ProjectBenefitsTier & { activeMemberCount?: number })[]
) {
  if (!tiers.length || amount < tiers[0].requiredStake) return null;
  return tiers.filter((tier) => amount >= tier.requiredStake).at(-1);
}

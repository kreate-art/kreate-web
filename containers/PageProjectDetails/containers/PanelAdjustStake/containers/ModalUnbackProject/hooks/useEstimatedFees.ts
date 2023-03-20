import { buildTx } from "../utils/transaction";

import { ResultT, try$ } from "@/modules/async-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount, ProjectBenefitsTier } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import { UseTxParams$BackerUnbackProject$Result } from "@/modules/next-backend-client/hooks/useTxParams$BackerUnbackProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  unbackLovelaceAmount: LovelaceAmount | undefined;
  message: string | undefined;
  projectStatus: ProjectStatus;
  projectTiers: (ProjectBenefitsTier & { activeMemberCount?: number })[];
  txParamsResult: UseTxParams$BackerUnbackProject$Result | undefined;
  stakingAmount: LovelaceAmount;
  disabled?: boolean;
};

export type TxBreakdown = {
  unbacking: LovelaceAmount; // +ve
  transaction: LovelaceAmount; // -ve
};

export function useEstimatedFees(
  params: Params
): ResultT<TxBreakdown> | undefined {
  const { walletStatus } = useAppContextValue$Consumer();

  const [txBreakdown, txBreakdown$Error] = useMemo$Async<TxBreakdown>(
    async () => {
      const {
        message,
        unbackLovelaceAmount,
        projectStatus,
        projectTiers,
        txParamsResult,
        stakingAmount,
        disabled,
      } = params;

      if (
        message == null ||
        unbackLovelaceAmount == null ||
        txParamsResult == null ||
        disabled
      ) {
        return undefined;
      }

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
        cause: params.txParamsResult,
      });

      const currentTier = amountToTier(stakingAmount, projectTiers);
      const newTier = amountToTier(
        sumLovelaceAmount([stakingAmount, -unbackLovelaceAmount]),
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

      const { txFee } = await try$(
        async () =>
          await buildTx({
            lucid: walletStatus.lucid,
            backerAddress: walletStatus.info.address,
            unbackLovelaceAmount: unbackLovelaceAmount,
            message: message,
            projectStatus,
            txParams: txParamsResult.data.txParams,
            action: "unback",
          }),
        (error) => {
          throw DisplayableError.from(error, "Transaction build failed");
        }
      );

      return {
        unbacking: unbackLovelaceAmount,
        transaction: -txFee,
      };
    },
    { debouncedDelay: 1000 },
    [
      toJson(params),
      walletStatus?.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
    ]
  );

  if (txBreakdown$Error) {
    return { ok: false, reason: txBreakdown$Error };
  } else if (txBreakdown) {
    return { ok: true, result: txBreakdown };
  } else {
    return undefined;
  }
}

function amountToTier(
  amount: LovelaceAmount,
  tiers: (ProjectBenefitsTier & { activeMemberCount?: number })[]
) {
  if (!tiers.length || amount < tiers[0].requiredStake) return null;
  return tiers.filter((tier) => amount >= tier.requiredStake).at(-1);
}

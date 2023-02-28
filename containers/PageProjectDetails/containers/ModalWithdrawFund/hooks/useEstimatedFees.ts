import { buildTx } from "../utils/transaction";

import { sleep, tryAsResultT } from "@/modules/async-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import {
  isAbortError,
  useAsyncComputation,
} from "@/modules/common-hooks/hooks/useAsyncComputation";
import { toJson } from "@/modules/json-utils";
import { UseTxParams$CreatorWithdrawFund$Result } from "@/modules/next-backend-client/hooks/useTxParams$CreatorWithdrawFund";
import { RATIO_MULTIPLIER } from "@/modules/protocol/constants";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { WalletStatus } from "@/modules/wallet/types";

type Params = {
  txParamsResult?: UseTxParams$CreatorWithdrawFund$Result;
};

export type TxBreakdown = {
  withdraw: LovelaceAmount;
  protocol: LovelaceAmount;
  transaction: LovelaceAmount;
};

export type Result =
  | { error: null; txBreakdown: TxBreakdown }
  | { error: "wallet-not-connected"; reason?: unknown }
  | { error: "tx-params-error"; reason?: unknown }
  | { error: "tx-build-error"; reason?: unknown }
  | { error: "unknown"; reason?: unknown };

export type UseEstimatedFees$Result = Result;

async function getEstimatedFees({
  params,
  walletStatus,
}: {
  params: Params;
  walletStatus: WalletStatus;
}): Promise<Result | undefined> {
  const { txParamsResult } = params;

  if (txParamsResult == null) return undefined;

  switch (walletStatus.status) {
    case "connected":
      break;
    case "disconnected":
      return { error: "wallet-not-connected" };
    case "unknown":
      return undefined;
    case "connecting":
      return undefined;
  }

  if (txParamsResult.error) {
    return { error: "tx-params-error", reason: txParamsResult.error };
  }

  const buildTx$ResultT = await tryAsResultT(
    async () =>
      await buildTx({
        lucid: walletStatus.lucid,
        txParams: txParamsResult.data.txParams,
      })
  );

  if (!buildTx$ResultT.ok) {
    return { error: "tx-build-error", reason: buildTx$ResultT.reason };
  }

  const { txFee } = buildTx$ResultT.result;
  const { protocolParams } = txParamsResult.computed;

  const withdrawAmount = sumLovelaceAmount(
    txParamsResult.data.txParams.rewardAddressAndAmount.map(
      ([_, amount]) => amount
    )
  );

  const txBreakdown: TxBreakdown = {
    withdraw: withdrawAmount,
    protocol:
      (-BigInt(withdrawAmount) * protocolParams.protocolFundsShareRatio) /
      RATIO_MULTIPLIER,
    transaction: -txFee,
  };

  return { error: null, txBreakdown };
}

export function useEstimatedFees(params: Params): Result | undefined {
  const { walletStatus } = useAppContextValue$Consumer();

  const result: Result | undefined = useAsyncComputation(
    [
      params,
      walletStatus.status,
      walletStatus.status === "connected" ? walletStatus.info : null,
    ],
    async (_, signal) => {
      try {
        await sleep(1000); // debounce
        signal.throwIfAborted();
        if (!params) return undefined;
        return await getEstimatedFees({ params, walletStatus });
      } catch (error) {
        if (isAbortError(error)) return undefined;
        return { error: "unknown", _debug: error };
      }
    }
  );

  return result;
}

export function formatReason(reason: unknown) {
  if (!reason) return undefined;
  if (reason instanceof Error) {
    return `[${reason.name}]: ${reason.message}`;
  }
  if (typeof reason === "string") {
    return reason;
  }
  return toJson(reason);
}

export function formatError$UseEstimatedFees$Result(
  result: UseEstimatedFees$Result | undefined
): { label: string; tooltip: string | undefined } | null {
  if (!result) return null;
  switch (result.error) {
    case null:
      return null;
    case "wallet-not-connected":
      return {
        label: "Wallet not connected or not ready",
        tooltip: formatReason(result.reason),
      };
    case "tx-params-error":
      return {
        label: "Transaction parameters invalid",
        tooltip: formatReason(result.reason),
      };
    case "tx-build-error":
      return {
        label: "Transaction build failed",
        tooltip: formatReason(result.reason),
      };
    case "unknown":
      return {
        label: "Unknown error",
        tooltip: formatReason(result.reason),
      };
  }
}

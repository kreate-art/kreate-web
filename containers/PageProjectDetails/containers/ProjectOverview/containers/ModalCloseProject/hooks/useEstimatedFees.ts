import { buildTx } from "../utils/transactions";

import { ResultT, try$ } from "@/modules/async-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { useTxParams$CreatorCloseProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorCloseProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

export type TxBreakdown = {
  pledge: LovelaceAmount;
  transaction: LovelaceAmount;
};

type Params = {
  projectId: string;
  disabled?: boolean;
};

export function useEstimatedFees({
  projectId,
  disabled,
}: Params): ResultT<TxBreakdown> | undefined {
  const { walletStatus } = useAppContextValue$Consumer();
  const txParamsResult = useTxParams$CreatorCloseProject({ projectId });

  const [txBreakdown, txBreakdown$Error] = useMemo$Async<TxBreakdown>(
    async () => {
      if (txParamsResult == null || disabled) return undefined;

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

      const { txComplete } = await try$(
        async () =>
          await buildTx({
            lucid: walletStatus.lucid,
            txParams: txParamsResult.data.txParams,
          }),
        (error) => {
          throw DisplayableError.from(error, "Transaction build failed");
        }
      );

      const txBreakdown: TxBreakdown = {
        pledge: sumLovelaceAmount(
          [
            ...txParamsResult.data.txParams.projectScriptInfoList.map(
              (info) => info.projectScriptUtxo
            ),
            txParamsResult.data.txParams.projectUtxo,
          ].map((utxo) => utxo.assets["lovelace"])
        ),
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
      };

      return txBreakdown;
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
      toJson(txParamsResult),
      projectId,
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

import * as UnbackTx from "../../../../PanelAdjustStake/containers/ModalUnbackProject/utils/transaction";

import { throw$, try$ } from "@/modules/async-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { Address, LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import { useTxParams$BackerUnbackProject } from "@/modules/next-backend-client/hooks/useTxParams$BackerUnbackProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  projectId: string | undefined;
  backerAddress: Address | undefined;
  projectStatus?: ProjectStatus;
  disabled?: boolean;
};

// In case of an non-active project, the inputs backing
// utxos must all be unbacked
export type TxBreakdown = {
  unbacking?: LovelaceAmount;
  transaction: LovelaceAmount;
};

export function useEstimatedFees({
  projectId,
  backerAddress,
  projectStatus,
  disabled,
}: Params): [TxBreakdown | undefined, unknown] {
  const { walletStatus } = useAppContextValue$Consumer();

  const unbackTxParamsResult = useTxParams$BackerUnbackProject({
    projectId,
    backerAddress,
    projectStatus,
  });

  return useMemo$Async(
    async (signal) => {
      if (!unbackTxParamsResult || !projectId || !backerAddress || disabled)
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

      DisplayableError.assert(!unbackTxParamsResult.error, {
        title: "Transaction parameters invalid",
        cause: unbackTxParamsResult,
      });

      const unbackLovelaceAmount =
        projectStatus == "active" || projectStatus === undefined
          ? BigInt(0)
          : BigInt(
              sumLovelaceAmount(
                unbackTxParamsResult.data.txParams.backingUtxos.map(
                  (utxo) => utxo.assets.lovelace
                )
              )
            );

      const tx = await UnbackTx.buildTxRaw({
        lucid: walletStatus.lucid,
        backerAddress,
        unbackLovelaceAmount,
        message: "",
        projectStatus,
        txParams: unbackTxParamsResult.data.txParams,
        action: "claim reward",
      });
      signal.throwIfAborted();

      const txComplete = await try$(
        async () => await tx.complete(),
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
        unbacking: unbackLovelaceAmount ? unbackLovelaceAmount : undefined,
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
      };
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
      toJson(unbackTxParamsResult),
      projectId,
      backerAddress,
      disabled,
    ]
  );
}

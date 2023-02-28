import { signAndSubmit } from "@teiki/protocol/helpers/lucid";
import { Lucid } from "lucid-cardano";

import * as UnbackTx from "../..//PanelAdjustStake/containers/ModalUnbackProject/utils/transaction";

import { throw$, try$ } from "@/modules/async-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { Address, ProjectId } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import {
  httpGetTxParams$BackerUnbackProject,
  ProjectStatus,
} from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";

export async function submitClaimTeikiTx({
  lucid,
  projectId,
  backerAddress,
  projectStatus,
  onProgress,
}: {
  lucid: Lucid;
  projectId: ProjectId;
  backerAddress: Address;
  projectStatus?: ProjectStatus;
  onProgress?: (statusText: string) => void;
}) {
  onProgress && onProgress("Fetching transaction params...");
  const unbackTxParamsResult = await httpGetTxParams$BackerUnbackProject({
    projectId,
    backerAddress,
    projectStatus,
  });

  onProgress && onProgress("Building transaction...");

  const now = Date.now();
  const timeProvider = () => now;

  /**
   * - If the project is still active, we unback 0 ADA so that user can keep
   * their backings unchanged
   * - Otherwise, we must unback all the ADA from the output as closed projects
   * cannot be backed
   */
  const { txComplete } = await try$(
    async () =>
      await UnbackTx.buildTx({
        lucid,
        backerAddress,
        unbackLovelaceAmount:
          projectStatus == "active" || projectStatus === undefined
            ? BigInt(0)
            : BigInt(
                sumLovelaceAmount(
                  unbackTxParamsResult.txParams.backingUtxos.map(
                    (utxo) => utxo.assets.lovelace
                  )
                )
              ),
        message: "",
        projectStatus,
        txParams: unbackTxParamsResult.txParams,
        timeProvider,
        action: "claim reward",
      }),
    (cause) =>
      throw$(new DisplayableError({ title: "Transaction build error", cause }))
  );

  onProgress && onProgress("Waiting for signature and submission...");
  const txHash = await try$(
    async () => await signAndSubmit(txComplete),
    (cause) => throw$(new Error("failed to sign or submit", { cause }))
  );

  onProgress && onProgress("Waiting for confirmation...");
  await lucid.awaitTx(txHash);

  onProgress && onProgress("Done.");

  return { txHash };
}

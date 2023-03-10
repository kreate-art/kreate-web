import { signAndSubmit } from "@teiki/protocol/helpers/lucid";
import { Lucid } from "lucid-cardano";

import * as UnbackTx from "../../../../../../../../PageProjectDetails/containers/PanelAdjustStake/containers/ModalUnbackProject/utils/transaction";

import { throw$, try$ } from "@/modules/async-utils";
import { Address, LovelaceAmount, ProjectId } from "@/modules/business-types";
import { httpGetTxParams$BackerUnbackProject } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";

export async function submitUnbackTx({
  lucid,
  oldProjectId,
  backedAmount,
  backerAddress,
  onProgress,
}: {
  lucid: Lucid;
  oldProjectId: ProjectId;
  backedAmount: LovelaceAmount;
  backerAddress: Address;
  onProgress?: (statusText: string) => void;
}) {
  onProgress && onProgress("Fetching transaction params...");
  const unbackTxParamsResult = await httpGetTxParams$BackerUnbackProject({
    projectId: oldProjectId,
    backerAddress: backerAddress,
    legacy: true,
  });

  onProgress && onProgress("Building transaction...");

  // unback from legacy protocol
  const { txComplete } = await UnbackTx.buildTx({
    lucid,
    backerAddress,
    unbackLovelaceAmount: backedAmount,
    message: "",
    txParams: unbackTxParamsResult.txParams,
    action: "unback",
  });

  onProgress && onProgress("Waiting for signature and submission...");
  const txHash = await try$(
    async () => await signAndSubmit(txComplete),
    (cause) => throw$(new Error("failed to sign or submit", { cause }))
  );

  onProgress && onProgress("Waiting for confirmation...");
  await lucid.awaitTx(txHash);

  onProgress && onProgress("Done.");
}

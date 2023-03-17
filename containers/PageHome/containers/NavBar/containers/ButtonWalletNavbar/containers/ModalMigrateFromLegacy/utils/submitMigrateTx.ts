import { signAndSubmit } from "@kreate/protocol/helpers/lucid";
import { Lucid } from "lucid-cardano";

import * as BackTx from "../../../../../../../../PageProjectDetails/containers/ModalBackProject/utils/transaction";
import * as UnbackTx from "../../../../../../../../PageProjectDetails/containers/PanelAdjustStake/containers/ModalUnbackProject/utils/transaction";

import { throw$, try$ } from "@/modules/async-utils";
import { Address, LovelaceAmount, ProjectId } from "@/modules/business-types";
import { httpGetTxParams$BackerBackProject } from "@/modules/next-backend-client/api/httpGetTxParams$BackerBackProject";
import { httpGetTxParams$BackerUnbackProject } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";

export async function submitMigrateTx({
  lucid,
  oldProjectId,
  newProjectId,
  backedAmount,
  backerAddress,
  onProgress,
}: {
  lucid: Lucid;
  oldProjectId: ProjectId;
  newProjectId: ProjectId;
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

  const backTxParamsResult = await httpGetTxParams$BackerBackProject({
    projectId: newProjectId,
  });

  onProgress && onProgress("Building transaction...");

  // unback from legacy protocol
  const unbackTxLegacy = await UnbackTx.buildTxRaw({
    lucid,
    backerAddress,
    unbackLovelaceAmount: backedAmount,
    message: "",
    txParams: unbackTxParamsResult.txParams,
    action: "migrate",
  });

  // back to new protocol
  const backTx = await BackTx.buildTxRaw({
    lucid,
    lovelaceAmount: backedAmount,
    message: "",
    txParams: backTxParamsResult.txParams,
  });

  // compose back and unback in a tx
  const tx = unbackTxLegacy.compose(backTx);

  const txComplete = await try$(
    async () => await tx.complete(),
    (cause) => throw$(new Error("failed to build tx", { cause }))
  );

  onProgress && onProgress("Waiting for signature and submission...");
  const txHash = await try$(
    async () => await signAndSubmit(txComplete),
    (cause) => throw$(new Error("failed to sign or submit", { cause }))
  );

  onProgress && onProgress("Waiting for confirmation...");
  await lucid.awaitTx(txHash);

  onProgress && onProgress("Done.");
}

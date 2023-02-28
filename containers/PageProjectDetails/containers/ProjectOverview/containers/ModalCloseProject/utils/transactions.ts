import {
  Params,
  finalizeCloseTx,
} from "@teiki/protocol/transactions/project/finalize-close";
import { Lucid, TxComplete } from "lucid-cardano";

import { TxParams$CreatorCloseProject } from "@/modules/next-backend/logic/getCreatorCloseProject";
import {
  PROJECT_AT_MPH,
  TX_TIME_END_PADDING,
} from "@/modules/protocol/constants";

/**
 * Builds transaction and returns a `TxComplete` plus other useful info.
 * After this step, field `txComplete` can be used to sign and submit by:
 *
 * ```
 * const txHash = await signAndSubmit(txComplete); // from "@teiki/protocol/helpers/lucid";
 * await lucid.awaitTx(txHash);
 * ```
 */
export async function buildTx({
  lucid,
  txParams,
}: {
  lucid: Lucid;
  txParams: TxParams$CreatorCloseProject;
}): Promise<{ txComplete: TxComplete }> {
  const params: Params = {
    ...txParams,
    projectAtPolicyId: PROJECT_AT_MPH,
    txTimeEndPadding: TX_TIME_END_PADDING,
  };
  const tx = finalizeCloseTx(lucid, params);
  // `nativeUplc` is specified as a temporary workaround for an Aiken bug
  const txComplete = await tx.complete({ nativeUplc: false });
  return { txComplete };
}

import {
  UpdateProjectParams,
  updateProjectTx,
} from "@teiki/protocol/transactions/project/update";
import { Lucid, TxComplete } from "lucid-cardano";

import { LovelaceAmount } from "@/modules/business-types";
import { TxParams$CreatorUpdateProject } from "@/modules/next-backend/logic/getCreatorUpdateProject";
import { getTxTimeStartPadding } from "@/modules/protocol/utils";

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
  newSponsorshipAmount,
  newInformationCid,
  newAnnouncementCid,
}: {
  lucid: Lucid;
  txParams: TxParams$CreatorUpdateProject;
  newSponsorshipAmount?: LovelaceAmount;
  newInformationCid: string | undefined;
  newAnnouncementCid: string | undefined;
}): Promise<{ sponsorshipFee: LovelaceAmount; txComplete: TxComplete }> {
  const txTimeStartPadding = await getTxTimeStartPadding();

  const params: UpdateProjectParams = {
    protocolParamsUtxo: txParams.protocolParamsUtxo,
    projectUtxo: txParams.projectUtxo,
    projectDetailUtxo: txParams.projectDetailUtxo,
    projectDetailVRefScriptUtxo: txParams.projectDetailVRefScriptUtxo,
    dedicatedTreasuryUtxo: txParams.dedicatedTreasuryUtxo,
    dedicatedTreasuryVRefScriptUtxo: txParams.dedicatedTreasuryVRefScriptUtxo,
    newSponsorshipAmount: newSponsorshipAmount
      ? BigInt(newSponsorshipAmount)
      : undefined,
    newInformationCid: newInformationCid
      ? { cid: newInformationCid }
      : undefined,
    newAnnouncementCid: newAnnouncementCid
      ? { cid: newAnnouncementCid }
      : undefined,
    txTimePadding: txTimeStartPadding,
  };
  const { sponsorshipFee, tx } = updateProjectTx(lucid, params);
  // `nativeUplc` is specified as a temporary workaround for an Aiken bug
  const txComplete = await tx.complete({ nativeUplc: false });
  return { sponsorshipFee, txComplete };
}

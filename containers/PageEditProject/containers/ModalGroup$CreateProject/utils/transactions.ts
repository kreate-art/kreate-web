import { compileProjectSvScript } from "@teiki/protocol/commands/compile-scripts";
import { exportScript } from "@teiki/protocol/contracts/compile";
import { constructProjectIdUsingBlake2b } from "@teiki/protocol/helpers/schema";
import {
  createProjectTx,
  CreateProjectParams,
} from "@teiki/protocol/transactions/project/create";
import { Address, Lucid, Tx, TxComplete } from "lucid-cardano";

import { tryUntil } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { EnrichedUtxo } from "@/modules/next-backend/types";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";
import { PROJECT_AT_MPH, PROTOCOL_NFT_MPH } from "@/modules/protocol/constants";
import { getTxTimeStartPadding } from "@/modules/protocol/utils";

export type BuildTxParams = {
  lucid: Lucid;
  informationCid: string;
  ownerAddress: Address;
  sponsorshipAmount: LovelaceAmount;
  protocolParamsUtxo: EnrichedUtxo;
  projectAtScriptReferenceUtxo: EnrichedUtxo;
};

export type BuildTxResult = {
  projectId: string;
  txFee: LovelaceAmount;
  txComplete: TxComplete;
};

export async function buildTx(params: BuildTxParams): Promise<BuildTxResult> {
  const { projectId, tx } = await buildTxRaw(params);
  const txComplete = await tx.complete();

  const txFee = BigInt(txComplete.txComplete.body().fee().to_str());

  return { projectId, txFee, txComplete };
}

export async function buildTxRaw({
  lucid,
  informationCid,
  ownerAddress,
  sponsorshipAmount,
  protocolParamsUtxo,
  projectAtScriptReferenceUtxo,
}: BuildTxParams): Promise<{ projectId: string; tx: Tx }> {
  assert(
    projectAtScriptReferenceUtxo.scriptRef != null &&
      projectAtScriptReferenceUtxo.scriptHash != null,
    "Invalid proof of backing reference UTxO: must reference proof of backing script"
  );

  const seedUtxo = (await lucid.wallet.getUtxos())[0];
  const projectId = constructProjectIdUsingBlake2b(seedUtxo);
  const projectAtMph = projectAtScriptReferenceUtxo.scriptHash;
  const stakingSeed = seedUtxo.txHash + String(seedUtxo.outputIndex);
  const projectStakeValidator = exportScript(
    compileProjectSvScript({
      projectId,
      stakingSeed,
      projectAtMph,
      protocolNftMph: PROTOCOL_NFT_MPH,
    })
  );
  const txTimeStartPadding = await getTxTimeStartPadding();

  const params: CreateProjectParams = {
    protocolParamsUtxo,
    informationCid: { cid: informationCid },
    sponsorshipAmount: BigInt(sponsorshipAmount),
    ownerAddress,
    projectAtScriptRefUtxo: projectAtScriptReferenceUtxo,
    projectATPolicyId: PROJECT_AT_MPH,
    projectStakeValidator,
    seedUtxo,
    txTimePadding: txTimeStartPadding,
  };
  const tx = createProjectTx(lucid, params).addSigner(ownerAddress);

  return { projectId, tx };
}

export async function waitUntilProjectIndexed(
  projectId: string
): Promise<void> {
  await tryUntil({
    run: () => httpGetProject({ projectId, preset: "minimal" }),
    until: (response) => response.error === undefined,
  });
}

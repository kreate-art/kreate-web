import * as S from "@kreate/protocol/schema";
import { ProtocolParamsDatum } from "@kreate/protocol/schema/teiki/protocol";

import { Sql } from "../db";
import { EnrichedUtxo } from "../types";

import { getDeployedScriptUtxo } from "./getDeployedScript";
import { getProjectScriptUtxoByProjectId } from "./getProjectScriptUtxoByProjectId";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { assert } from "@/modules/common-utils";
import { PROOF_OF_BACKING_MPH } from "@/modules/protocol/constants";

export type TxParams$BackerBackProject = {
  protocolParamsUtxo: EnrichedUtxo;
  projectUtxo: EnrichedUtxo;
  projectScriptUtxo: EnrichedUtxo;
  proofOfBackingMpRefUtxo: EnrichedUtxo;
  backingScriptRefUtxo: EnrichedUtxo;
};

export async function getBackerBackProject(
  sql: Sql,
  { projectId }: { projectId: string }
): Promise<TxParams$BackerBackProject> {
  const protocolParamsUtxo = await getProtocolParamsUtxo(sql);

  assert(
    protocolParamsUtxo?.datum != null,
    "Invalid protocol params UTxO: Missing inline datum"
  );

  const protocolParams = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  const [
    projectUtxo,
    projectScriptUtxo,
    proofOfBackingMpRefUtxo,
    backingScriptRefUtxo,
  ] = await Promise.all([
    getProjectUtxoByProjectId(sql, { projectId }),
    getProjectScriptUtxoByProjectId(sql, {
      projectId,
    }),
    getDeployedScriptUtxo(sql, { scriptHash: PROOF_OF_BACKING_MPH }),
    getDeployedScriptUtxo(sql, {
      scriptHash: protocolParams.registry.backingValidator.latest.script.hash,
    }),
  ]);

  assert(
    projectUtxo?.datum != null,
    "Invalid project UTxO: Missing inline datum"
  );
  assert(projectScriptUtxo != null, "Missing project script UTxO");
  assert(backingScriptRefUtxo != null, "Missing reference backing script UTxO");
  assert(
    proofOfBackingMpRefUtxo,
    "Missing reference proof of backing minting policy UTxO"
  );

  return {
    protocolParamsUtxo: protocolParamsUtxo,
    projectUtxo,
    projectScriptUtxo,
    proofOfBackingMpRefUtxo,
    backingScriptRefUtxo,
  };
}

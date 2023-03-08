import { parseProtocolParams } from "@teiki/protocol/helpers/schema";
import * as S from "@teiki/protocol/schema";
import { TeikiMintingInfo } from "@teiki/protocol/transactions/backing/plant";

import { Sql } from "../db";
import { EnrichedUtxo } from "../types";

import { getBackerBackingUtxosByProjectId } from "./getBackerBackingUtxosByProjectId";
import { getDeployedScriptUtxo } from "./getDeployedScript";
import { getProjectScriptUtxoByProjectId } from "./getProjectScriptUtxoByProjectId";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";
import { getRandomSharedTreasuryUtxoByProjectId } from "./getSharedTreasuryUtxoByProjectId";
import { getTeikiPlantUtxo } from "./getTeikiPlantUtxo";

import { assert } from "@/modules/common-utils";
import { TEIKI_MPH } from "@/modules/protocol/constants";

type Params = {
  active?: boolean;
  projectId: string;
  backerAddress: string;
  proofOfBackingMph: string;
};

export type TxParams$BackerUnbackProject = {
  protocolParamsUtxo: EnrichedUtxo;
  projectUtxo: EnrichedUtxo;
  projectScriptUtxo?: EnrichedUtxo;
  proofOfBackingMpRefUtxo: EnrichedUtxo;
  backingScriptRefUtxo: EnrichedUtxo;
  backingUtxos: EnrichedUtxo[];
  teikiMintingInfo?: TeikiMintingInfo;
};

// TODO: @sk-saru support claim teiki rewards
export async function getBackerUnbackProject(
  sql: Sql,
  { active, projectId, backerAddress, proofOfBackingMph }: Params
): Promise<TxParams$BackerUnbackProject> {
  const [
    backingUtxos,
    protocolParamsUtxo,
    projectUtxo,
    proofOfBackingMpRefUtxo,
    teikiPlantVRefUtxo,
    teikiMpRefUtxo,
    projectScriptUtxo,
    sharedTreasuryUtxo,
  ] = await Promise.all([
    getBackerBackingUtxosByProjectId(sql, { backerAddress, projectId }),
    getProtocolParamsUtxo(sql),
    getProjectUtxoByProjectId(sql, { projectId }),
    getDeployedScriptUtxo(sql, { scriptHash: proofOfBackingMph }),
    getTeikiPlantUtxo(sql),
    getDeployedScriptUtxo(sql, {
      scriptHash: TEIKI_MPH,
    }),
    getProjectScriptUtxoByProjectId(sql, {
      projectId,
    }),
    getRandomSharedTreasuryUtxoByProjectId(sql, {
      projectId,
    }),
  ]);

  assert(
    protocolParamsUtxo?.datum != null,
    "invalid protocol params utxo: missing inline datum"
  );

  assert(
    projectUtxo?.datum != null,
    "invalid project utxo: missing inline datum"
  );

  const { protocolParams } = parseProtocolParams(
    S.fromCbor(protocolParamsUtxo.datum)
  );

  const [sharedTreasuryVRefUtxo, backingScriptRefUtxo] = await Promise.all([
    getDeployedScriptUtxo(sql, {
      scriptHash:
        protocolParams.registry.sharedTreasuryValidator.latest.script.hash,
    }),
    getDeployedScriptUtxo(sql, {
      scriptHash: protocolParams.registry.backingValidator.latest.script.hash,
    }),
  ]);

  let teikiMintingInfo: TeikiMintingInfo | undefined = undefined;
  if (sharedTreasuryUtxo) {
    assert(teikiMpRefUtxo, "Missing reference Teiki minting policy UTxO");
    assert(teikiPlantVRefUtxo, "Missing reference Teiki plant script UTxO");
    assert(
      sharedTreasuryVRefUtxo,
      "Missing reference shared treasury script UTxO"
    );
    teikiMintingInfo = {
      teikiMph: TEIKI_MPH,
      teikiMpRefUtxo,
      teikiPlantVRefUtxo,
      sharedTreasuryVRefUtxo,
      sharedTreasuryUtxo,
    };
  }

  assert(backingScriptRefUtxo != null, "Missing reference backing script UTxO");
  assert(
    proofOfBackingMpRefUtxo != null,
    "Missing reference proof of backing minting policy script UTxO"
  );
  if (active) assert(projectScriptUtxo != null, "Missing project script UTxO");

  return {
    protocolParamsUtxo: protocolParamsUtxo,
    projectUtxo,
    projectScriptUtxo:
      projectScriptUtxo != null ? projectScriptUtxo : undefined,
    proofOfBackingMpRefUtxo,
    backingScriptRefUtxo,
    backingUtxos,
    teikiMintingInfo,
  };
}

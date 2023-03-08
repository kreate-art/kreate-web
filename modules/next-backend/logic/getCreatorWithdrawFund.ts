import * as S from "@teiki/protocol/schema";
import { ProtocolParamsDatum } from "@teiki/protocol/schema/teiki/protocol";
import { ProjectScriptInfo } from "@teiki/protocol/transactions/project/finalize-close";
import { RewardAddress, UTxO } from "lucid-cardano";

import { Sql } from "../connections";
import { EnrichedUtxo } from "../types";

import { getAllProjectScripts } from "./getAllProjectScripts";
import { getDedicatedTreasuryUtxo } from "./getDedicatedTreasuryUtxo";
import { getDeployedScriptUtxo } from "./getDeployedScript";
import { getProjectDetailUtxo } from "./getProjectDetailUtxo";
import { getProjectRewardAddressAndAmount } from "./getProjectRewardAddressAndAmount";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";

export type TxParams$CreatorWithdrawFund = {
  protocolParamsUtxo: UTxO;
  projectUtxo: UTxO;
  projectDetailUtxo: UTxO;
  dedicatedTreasuryUtxo: UTxO;
  projectVRefScriptUtxo: EnrichedUtxo;
  projectDetailVRefScriptUtxo: EnrichedUtxo;
  projectScriptInfoList: ProjectScriptInfo[];
  dedicatedTreasuryVRefScriptUtxo: EnrichedUtxo;
  rewardAddressAndAmount: [RewardAddress, LovelaceAmount][];
};

export async function getCreatorWithdrawFund(
  sql: Sql,
  { projectId }: { projectId: string }
): Promise<TxParams$CreatorWithdrawFund> {
  const [protocolParamsUtxo, projectUtxo] = await Promise.all([
    getProtocolParamsUtxo(sql),
    getProjectUtxoByProjectId(sql, { projectId }),
  ]);

  assert(
    protocolParamsUtxo?.datum != null,
    "Invalid protocol params UTxO: Missing inline datum"
  );

  assert(
    projectUtxo?.datum != null,
    "Invalid project UTxO: Missing inline datum"
  );

  const protocolParamsDatum = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  const [
    projectDetailUtxo,
    dedicatedTreasuryUtxo,
    projectVRefScriptUtxo,
    projectDetailVRefScriptUtxo,
    dedicatedTreasuryVRefScriptUtxo,
    projectScriptInfoList,
    rewardAddressAndAmount,
  ] = await Promise.all([
    getProjectDetailUtxo(sql, { projectId }),
    getDedicatedTreasuryUtxo(sql, { projectId }),
    getDeployedScriptUtxo(sql, {
      scriptHash:
        protocolParamsDatum.registry.projectValidator.latest.script.hash,
    }),
    getDeployedScriptUtxo(sql, {
      scriptHash:
        protocolParamsDatum.registry.projectDetailValidator.latest.script.hash,
    }),
    getDeployedScriptUtxo(sql, {
      scriptHash:
        protocolParamsDatum.registry.dedicatedTreasuryValidator.latest.script
          .hash,
    }),
    getAllProjectScripts(sql, { projectId }),
    getProjectRewardAddressAndAmount(sql, {
      projectId,
    }),
  ]);

  assert(projectDetailUtxo, "Missing project detail UTxO");
  assert(dedicatedTreasuryUtxo, "Missing dedicated UTxO");
  assert(projectVRefScriptUtxo, "Missing reference project script UTxO");
  assert(
    projectDetailVRefScriptUtxo,
    "Missing reference project-detail script UTxO"
  );
  assert(
    dedicatedTreasuryVRefScriptUtxo,
    "Missing reference dedicated treasury script UTxO"
  );

  return {
    protocolParamsUtxo,
    projectUtxo,
    projectDetailUtxo,
    dedicatedTreasuryUtxo,
    projectVRefScriptUtxo,
    projectDetailVRefScriptUtxo,
    dedicatedTreasuryVRefScriptUtxo,
    projectScriptInfoList,
    rewardAddressAndAmount,
  };
}

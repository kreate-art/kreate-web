import * as S from "@kreate/protocol/schema";
import { ProtocolParamsDatum } from "@kreate/protocol/schema/teiki/protocol";
import { ProjectScriptInfo } from "@kreate/protocol/transactions/project/finalize-close";
import { UTxO } from "lucid-cardano";

import { Sql } from "../db";
import { EnrichedUtxo } from "../types";

import { getAllProjectScripts } from "./getAllProjectScripts";
import { getDeployedScriptUtxo } from "./getDeployedScript";
import { getProjectDetailUtxo } from "./getProjectDetailUtxo";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { assert } from "@/modules/common-utils";
import { PROJECT_AT_MPH } from "@/modules/protocol/constants";

export type TxParams$CreatorCloseProject = {
  protocolParamsUtxo: UTxO;
  projectUtxo: UTxO;
  projectDetailUtxo: UTxO;
  projectVRefScriptUtxo: EnrichedUtxo;
  projectDetailVRefScriptUtxo: EnrichedUtxo;
  projectScriptVRefScriptUtxo: EnrichedUtxo;
  projectScriptInfoList: ProjectScriptInfo[];
  projectAtScriptUtxo: EnrichedUtxo;
};

export async function getCreatorCloseProject(
  sql: Sql,
  { projectId }: { projectId: string }
): Promise<TxParams$CreatorCloseProject> {
  const protocolParamsUtxo = await getProtocolParamsUtxo(sql);

  assert(
    protocolParamsUtxo?.datum != null,
    "Invalid protocol params UTxO: Missing inline datum"
  );

  const protocolParamsDatum = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  const [
    projectUtxo,
    projectDetailUtxo,
    projectVRefScriptUtxo,
    projectDetailVRefScriptUtxo,
    projectScriptVRefScriptUtxo,
    projectScriptInfoList,
    projectAtScriptUtxo,
  ] = await Promise.all([
    getProjectUtxoByProjectId(sql, { projectId }),
    getProjectDetailUtxo(sql, { projectId }),
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
        protocolParamsDatum.registry.projectScriptValidator.latest.script.hash,
    }),
    getAllProjectScripts(sql, { projectId }),
    getDeployedScriptUtxo(sql, {
      scriptHash: PROJECT_AT_MPH,
    }),
  ]);

  assert(projectUtxo, "Missing project UTxO");
  assert(projectDetailUtxo, "Missing project detail UTxO");
  assert(projectVRefScriptUtxo, "Missing reference project.v script UTxO");
  assert(
    projectDetailVRefScriptUtxo,
    "Missing referenec project detail script UTxO"
  );
  assert(
    projectScriptVRefScriptUtxo,
    "Missing reference project-script.v script UTxO"
  );
  assert(
    projectAtScriptUtxo,
    "Missing reference project.at minting policy UTxO"
  );
  return {
    protocolParamsUtxo,
    projectUtxo,
    projectDetailUtxo,
    projectVRefScriptUtxo,
    projectDetailVRefScriptUtxo,
    projectScriptVRefScriptUtxo,
    projectScriptInfoList,
    projectAtScriptUtxo,
  };
}

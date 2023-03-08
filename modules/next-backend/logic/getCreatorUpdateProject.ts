import * as S from "@teiki/protocol/schema";
import { ProjectDatum } from "@teiki/protocol/schema/teiki/project";
import { ProtocolParamsDatum } from "@teiki/protocol/schema/teiki/protocol";
import { UTxO } from "lucid-cardano";

import { Sql } from "../db";
import { EnrichedUtxo } from "../types";

import { getDedicatedTreasuryUtxo } from "./getDedicatedTreasuryUtxo";
import { getDeployedScriptUtxo } from "./getDeployedScript";
import { getProjectDetailUtxo } from "./getProjectDetailUtxo";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { assert } from "@/modules/common-utils";

export type TxParams$CreatorUpdateProject = {
  protocolParamsUtxo: UTxO;
  projectUtxo: UTxO;
  projectDetailUtxo: UTxO;
  dedicatedTreasuryUtxo: UTxO;
  projectDetailVRefScriptUtxo: EnrichedUtxo;
  dedicatedTreasuryVRefScriptUtxo: EnrichedUtxo;
};

export async function getCreatorUpdateProject(
  sql: Sql,
  { projectId }: { projectId: string }
): Promise<TxParams$CreatorUpdateProject> {
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

  const projectDatum = S.fromData(S.fromCbor(projectUtxo.datum), ProjectDatum);

  const [
    projectDetailUtxo,
    dedicatedTreasuryUtxo,
    projectDetailVRefScriptUtxo,
    dedicatedTreasuryVRefScriptUtxo,
  ] = await Promise.all([
    getProjectDetailUtxo(sql, {
      projectId: projectDatum.projectId.id,
    }),
    getDedicatedTreasuryUtxo(sql, {
      projectId: projectDatum.projectId.id,
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
  ]);

  assert(projectDetailUtxo, "Missing project detail UTxO");
  assert(dedicatedTreasuryUtxo, "Missing dedicated UTxO");
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
    projectDetailVRefScriptUtxo,
    dedicatedTreasuryVRefScriptUtxo,
  };
}

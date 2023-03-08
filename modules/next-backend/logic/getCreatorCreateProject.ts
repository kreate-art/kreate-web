import { Sql } from "../connections";
import { EnrichedUtxo } from "../types";

import { getDeployedScriptUtxo } from "./getDeployedScript";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { assert } from "@/modules/common-utils";
import { PROJECT_AT_MPH } from "@/modules/protocol/constants";

export type TxParams$CreatorCreateProject$Response = {
  protocolParamsUtxo: EnrichedUtxo;
  projectAtScriptReferenceUtxo: EnrichedUtxo;
};

export async function getCreatorCreateProject(
  sql: Sql
): Promise<TxParams$CreatorCreateProject$Response> {
  const [protocolParamsUtxo, projectAtScriptReferenceUtxo] = await Promise.all([
    getProtocolParamsUtxo(sql),
    getDeployedScriptUtxo(sql, { scriptHash: PROJECT_AT_MPH }),
  ]);

  assert(protocolParamsUtxo, "Missing protocol params UTxO");

  assert(
    projectAtScriptReferenceUtxo,
    "Missing reference project.at minting policy UTxO"
  );

  return {
    protocolParamsUtxo,
    projectAtScriptReferenceUtxo,
  };
}

import { Hex } from "@kreate/protocol/types";

import { Sql } from "../db";
import { ChainOutputWithScript, toLucidUtxo } from "../types";

// TODO: @sk-saru should select project script by current staking amount
// TODO: @sk-umiuma: The function name is rather confusing
// to differentiate between project.v and project-script.v
export async function getAllProjectScripts(
  sql: Sql,
  { projectId }: { projectId: Hex }
) {
  const results = await sql<(ChainOutputWithScript & { rewards: bigint })[]>`
    SELECT
      o.*,
      sc.script_type,
      sc.script,
      coalesce(st.rewards, 0) as rewards
    FROM
      chain.project_script AS ps
      INNER JOIN chain.output o ON o.id = ps.id
      INNER JOIN chain.script sc ON sc.script_hash = ps.staking_script_hash
      LEFT JOIN chain.staking_state st ON st.hash = ps.staking_script_hash
    WHERE
      ps.project_id = ${projectId}
      AND o.spent_slot IS NULL
    ORDER BY
      o.created_slot DESC
  `;

  return results.map(({ rewards, ...utxo }) => ({
    rewardAmount: rewards,
    projectScriptUtxo: toLucidUtxo(utxo),
  }));
}

import { Hex } from "@kreate/protocol/types";

import { Sql } from "../db";
import { toLucidUtxo, ChainOutputWithScript, EnrichedUtxo } from "../types";

export async function getDeployedScriptUtxo(
  sql: Sql,
  { scriptHash }: { scriptHash: Hex }
): Promise<EnrichedUtxo | null> {
  const results = await sql<ChainOutputWithScript[]>`
    SELECT
      o.*,
      s.script_type,
      s.script
    FROM
      chain.script s
    INNER JOIN chain.output o ON
      s.script_hash = o.script_hash
    WHERE
      o.spent_slot IS NULL
      AND s.script_hash = ${scriptHash}
    LIMIT
      1
  `;
  return results.length ? toLucidUtxo(results[0]) : null;
}

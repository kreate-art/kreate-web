import { Hex } from "@teiki/protocol/types";

import { Sql } from "../connections";
import { toLucidUtxo, ChainOutput } from "../types";

export async function getProjectDetailUtxo(
  sql: Sql,
  { projectId }: { projectId: Hex }
) {
  const results = await sql<ChainOutput[]>`
    SELECT
      o.*
    FROM
      chain.project_detail d
    INNER JOIN
      chain.output o
    ON
      d.id = o.id
    WHERE
      d.project_id = ${projectId}
      AND o.spent_slot IS NULL
    LIMIT
      1
  `;

  return results.length ? toLucidUtxo(results[0]) : null;
}

import { Sql } from "../connections";
import { ChainOutput, toLucidUtxo } from "../types";

export async function getProjectUtxoByProjectId(
  sql: Sql,
  { projectId }: { projectId: string }
) {
  const results = await sql<ChainOutput[]>`
    SELECT
      o.*
    FROM
      chain.project AS p
      INNER JOIN chain.output o ON o.id = p.id
    WHERE
      p.project_id = ${projectId}
      AND o.spent_slot IS NULL
      AND NOT EXISTS (
        SELECT FROM admin.blocked_project bp
        WHERE bp.project_id = p.project_id
      )
    LIMIT
      1
  `;

  return results.length ? toLucidUtxo(results[0]) : null;
}

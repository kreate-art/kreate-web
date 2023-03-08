import { Sql } from "../connections";
import { ChainOutput, toLucidUtxo } from "../types";

export async function getRandomSharedTreasuryUtxoByProjectId(
  sql: Sql,
  { projectId }: { projectId: string }
) {
  const results = await sql<ChainOutput[]>`
    SELECT
      o.*
    FROM
      chain.shared_treasury st
    INNER JOIN
      chain.output o
    ON
      o.id = st.id
    WHERE
      st.project_id = ${projectId}
      AND o.spent_slot IS NULL
    ORDER BY
      RANDOM()
    LIMIT
      1
  `;

  return results.length ? toLucidUtxo(results[0]) : null;
}

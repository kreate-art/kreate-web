import { Sql } from "../connections";
import { ChainOutput, toLucidUtxo } from "../types";

export async function getBackerBackingUtxosByProjectId(
  sql: Sql,
  {
    backerAddress,
    projectId,
  }: {
    backerAddress: string;
    projectId: string;
  }
) {
  const results = await sql<ChainOutput[]>`
    SELECT
      o.*
    FROM
      chain.backing b
    INNER JOIN
      chain.output o
    ON
      o.id = b.id
    WHERE
      b.backer_address = ${backerAddress}
      AND b.project_id = ${projectId}
      AND o.spent_slot is null
    ORDER BY
      b.backing_amount DESC
  `;

  return results.map((output) => toLucidUtxo(output));
}

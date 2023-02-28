import { Sql } from "../db";
import { ChainOutput, toLucidUtxo } from "../types";

export async function getTeikiPlantUtxo(sql: Sql) {
  const results = await sql<ChainOutput[]>`
    SELECT
      o.*
    FROM
      chain.teiki_plant tp
    INNER JOIN
      chain.output o
    ON
      o.id = tp.id
    WHERE
      o.spent_slot IS NULL
    LIMIT
      1
  `;

  return results.length ? toLucidUtxo(results[0]) : null;
}

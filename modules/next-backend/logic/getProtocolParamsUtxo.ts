import { Sql } from "../connections";
import { ChainOutput, toLucidUtxo } from "../types";

export async function getProtocolParamsUtxo(sql: Sql) {
  const results = await sql<ChainOutput[]>`
    SELECT
      o.*
    FROM
      chain.protocol_params pp
    INNER JOIN
      chain.output o
    ON
      o.id = pp.id
    WHERE
      o.spent_slot IS NULL
    LIMIT
      1
  `;

  return results.length ? toLucidUtxo(results[0]) : null;
}

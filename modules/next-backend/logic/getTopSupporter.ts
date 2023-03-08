import { Address } from "lucid-cardano";

import { Sql } from "../connections";

type Params = {
  projectId?: string;
};

type Response = {
  address: Address;
  lovelaceAmount: bigint;
}[];

export async function getTopSupporter(
  sql: Sql,
  { projectId }: Params
): Promise<Response> {
  const results = await sql`
    SELECT
      b.backer_address,
      sum(b.backing_amount) lovelace_amount
    FROM
      chain.backing b
      INNER JOIN chain.output o ON o.id = b.id
    WHERE
      o.spent_slot IS NULL
      AND ${projectId != null ? sql`b.project_id = ${projectId}` : sql`TRUE`}
      AND NOT EXISTS (SELECT FROM admin.blocked_project bp WHERE bp.project_id = b.project_id)
    GROUP BY
      b.backer_address
    ORDER BY
      lovelace_amount DESC;
  `;

  return results.map(({ backerAddress, lovelaceAmount }) => ({
    address: backerAddress,
    lovelaceAmount,
  }));
}

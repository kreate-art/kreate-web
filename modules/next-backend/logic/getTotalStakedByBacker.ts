import { Sql } from "../db";

export type TotalStakedByBacker$Response = {
  amount: bigint;
};

type Params = {
  backerAddress: string;
  projectId: string;
};

export async function getTotalStakedByBacker(
  sql: Sql,
  { backerAddress, projectId }: Params
): Promise<TotalStakedByBacker$Response> {
  const results = await sql`
    SELECT
      SUM(b.backing_amount) AS total_staking
    FROM
      chain.backing b
      INNER JOIN chain.output o ON b.id = o.id
    WHERE
      b.backer_address = ${backerAddress}
      AND b.project_id = ${projectId}
      AND o.spent_slot IS NULL
  `;

  return {
    amount: BigInt(results[0].totalStaking ?? 0),
  };
}

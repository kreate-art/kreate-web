import { Address } from "lucid-cardano";

import { Sql } from "../connections";

export type Params = { relevantAddress: Address };

type Response = { tags: string[] };

export async function getBackingTags(
  sql: Sql,
  { relevantAddress }: Params
): Promise<Response> {
  const backingTags = await sql<{ tag: string }[]>`
    SELECT
      DISTINCT tag
    FROM (
      SELECT
        UNNEST (pi.tags) tag
      FROM
        chain.backing b
        INNER JOIN chain.output o ON b.id = o.id
        INNER JOIN chain.project_detail pd ON b.project_id = pd.project_id
        INNER JOIN ipfs.project_info pi ON pd.information_cid = pi.cid
      WHERE
        o.spent_slot IS NULL
        AND b.backer_address = ${relevantAddress}
    ) foo
  `;

  return { tags: backingTags.map(({ tag }) => tag) };
}

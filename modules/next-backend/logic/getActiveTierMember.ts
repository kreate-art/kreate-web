import { Sql } from "../db";

type Params = {
  projectId: string;
};

export async function getActiveTierMember(sql: Sql, { projectId }: Params) {
  const results = await sql<
    {
      totalActiveMember: bigint;
      tier: number;
      tierId: string;
      maxTierMember: number | null;
    }[]
  >`
    WITH staked_tier_info AS (
      SELECT
        (arr.obj -> 'requiredStake')::bigint AS staked_at_least,
        (arr.obj -> 'id') AS tier_id,
        (arr.obj -> 'maximumMembers') AS max_tier_member,
        arr.tier AS tier,
        b.backer_address,
        sum(b.backing_amount)::bigint AS staked_total
      FROM
        chain.project_detail pd
        INNER JOIN ipfs.project_info pi2 ON pd.information_cid = pi2.cid
        INNER JOIN chain."output" o ON o.id = pd.id
        INNER JOIN chain.backing b ON b.project_id = pd.project_id,
        jsonb_array_elements((
          COALESCE (
            pi2.contents #> '{data, tiers}',
            '[{
              "requiredStake": 5000000,
              "tier": 1,
              "id": "default",
              "maximumMembers": null
            }]'
          )
        )) with ordinality arr(obj, tier)
        WHERE o.spent_slot IS NULL AND pd.project_id = ${projectId}
        GROUP BY
          b.backer_address,
          arr.obj,
          arr.tier
        ORDER BY (arr.obj ->> 'requiredStake') ASC
    ),
    staked_with_tier AS (
      SELECT DISTINCT ON (s.backer_address)
        s.*
      FROM
        staked_tier_info s
      WHERE
        s.staked_total >= s.staked_at_least
      ORDER BY
        s.backer_address,
        s.tier desc
    )
    SELECT
      count(swt.backer_address) AS total_active_member,
      swt.tier,
      swt.tier_id,
      swt.max_tier_member
    FROM
      staked_with_tier swt
    GROUP BY
      tier,
      tier_id,
      max_tier_member
  `;
  return results;
}

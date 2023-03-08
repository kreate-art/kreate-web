import { RewardAddress, ScriptHash } from "lucid-cardano";

import { Sql } from "../connections";

import { LovelaceAmount } from "@/modules/business-types";

export type Params = { projectId: string };
export type Response = { error: undefined; scriptHashes: ScriptHash[] };
type ProjectReward = {
  address: string;
  rewards: bigint;
};

export async function getProjectRewardAddressAndAmount(
  sql: Sql,
  { projectId }: Params
): Promise<[RewardAddress, LovelaceAmount][]> {
  const results = await sql<ProjectReward[]>`
    SELECT
      ss.address,
      ss.rewards
    FROM
      chain.project_script ps
      INNER JOIN chain.output o ON ps.id = o.id
      INNER JOIN chain.staking_state ss ON ps.staking_script_hash = ss.hash
    WHERE
      o.spent_slot IS NULL
      AND ps.project_id = ${projectId};
  `;

  return results.map(({ address, rewards }) => [address, rewards]);
}

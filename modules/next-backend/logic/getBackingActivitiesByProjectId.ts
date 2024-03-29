import { TxHash } from "lucid-cardano";

import { Sql } from "../db";
import { ActionTypes } from "../types";

import {
  LovelaceAmount,
  ProjectId,
  UnixTimestamp,
} from "@/modules/business-types";

export type ProjectBackingActivity = {
  action: (typeof ActionTypes)[number];
  actor: string;
  time: UnixTimestamp;
  message: string | null;
  amount: LovelaceAmount;
  txId: TxHash;
};

type SqlProjectBackingActivity = Omit<ProjectBackingActivity, "time"> & {
  time: Date;
};

export type BackingActivitiesByProject$Response = {
  backingData: ProjectBackingActivity[];
};

type Params = {
  projectId: ProjectId;
};

export async function getBackingActivities(
  sql: Sql,
  { projectId }: Params
): Promise<BackingActivitiesByProject$Response> {
  // NOTE: We rely on SC's state in order to preserve
  // back/unback time through migrations
  const backingData = await sql<SqlProjectBackingActivity[]>`
    SELECT
      ba.action,
      ba.actor_address AS actor,
      ba.time,
      ba.message,
      ba.amount,
      ba.tx_id
    FROM
      chain.backing_action ba
    WHERE ba.project_id = ${projectId}
    ORDER BY time DESC;
  `;
  const result: ProjectBackingActivity[] = backingData
    .filter((item) => !(item.action === "unback" && item.amount <= 0)) // Ignore claim rewards activity for now.
    .map(({ time, ...others }) => {
      return {
        time: time.valueOf(),
        ...others,
      };
    });
  return { backingData: result };
}

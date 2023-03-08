import { Sql } from "../connections";
import { ChainBackingAction } from "../types";

import { UnixTimestamp } from "@/modules/business-types";

type Params = {
  txHash: string;
};

type SqlBackingActivitiesByTxHash = Omit<ChainBackingAction, "txId">;

type BackingActivitiesByTxHash = Omit<SqlBackingActivitiesByTxHash, "time"> & {
  time: UnixTimestamp;
};

export type BackingActivitiesByTxHash$Response = {
  activities: BackingActivitiesByTxHash[];
};

export default async function getBackingActionsByTxHash(
  sql: Sql,
  { txHash }: Params
) {
  const results = await sql<SqlBackingActivitiesByTxHash[]>`
    SELECT
      ba.action,
      ba.project_id,
      ba.actor_address,
      ba.amount,
      ba.time,
      ba.message,
      ba.slot
    FROM chain.backing_action ba
    WHERE ba.tx_id = ${txHash}
  `;
  const response: BackingActivitiesByTxHash$Response = {
    activities: results.map(({ time, ...others }) => {
      return {
        time: time.valueOf(),
        ...others,
      };
    }),
  };
  return response;
}

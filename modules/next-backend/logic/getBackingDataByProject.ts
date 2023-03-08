import { Sql } from "../connections";
import { ChainBackingAction } from "../types";

import { ProjectId } from "@/modules/business-types";

type ProjectBacking = Omit<
  ChainBackingAction,
  "projectId" | "message" | "slot" | "txId"
>;

export type BackingDataByProject$Response = {
  cursor: AsyncIterable<ProjectBacking[]>;
};

type Params = {
  projectId: ProjectId;
};

export async function getBackingDataByProject(
  sql: Sql,
  { projectId }: Params
): Promise<BackingDataByProject$Response> {
  // NOTE: We rely on SC's state in order to preserve
  // back/unback time through migrations
  const cursor = sql<ProjectBacking[]>`
    SELECT
      ba.action,
      ba.actor_address,
      ba.amount,
      ba.time
    FROM
      chain.backing_action ba
    WHERE
      ba.project_id = ${projectId}
      AND ba.action <> 'migrate'
    ORDER BY
      ba.time DESC
  `.cursor(100);
  return { cursor };
}

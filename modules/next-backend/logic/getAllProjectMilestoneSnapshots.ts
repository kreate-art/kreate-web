// NOTE: @sk-yagi: The term `milestone` here refers to Protocol Milestone
// given in Protocol parameters (NOT milestone in Project Roadmap)
import { Sql } from "../db";

import { UnixTimestamp } from "@/modules/business-types";

export type ProjectMilestoneSnapshot = {
  time: UnixTimestamp;
  milestoneReached: number;
};

type Params = {
  projectId: string;
};

export async function getAllProjectMilestoneSnapshots(
  sql: Sql,
  { projectId }: Params
): Promise<ProjectMilestoneSnapshot[]> {
  const results = await sql`
    SELECT mr.id, mr.milestone_reached, bk.time
    FROM
      (SELECT * FROM
        (
          SELECT id, project_id, milestone_reached AS milestone_reached, lag(milestone_reached)
            OVER (ORDER BY id)
            AS prev_milestone_reached
            FROM chain.project
            WHERE project_id = ${projectId}
        ) _mr
        WHERE milestone_reached IS DISTINCT FROM prev_milestone_reached AND milestone_reached > 0
      ) AS mr
      INNER JOIN chain.output o ON mr.id = o.id
      INNER JOIN chain.block bk ON o.created_slot = bk.slot
    ORDER BY bk.slot DESC
  `;

  const allMilestoneSnapshots: ProjectMilestoneSnapshot[] = results.map(
    (result) => {
      return {
        time: result.time?.valueOf(),
        milestoneReached: result.milestoneReached,
      };
    }
  );

  return allMilestoneSnapshots;
}

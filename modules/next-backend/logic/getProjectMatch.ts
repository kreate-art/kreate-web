import { Address } from "lucid-cardano";

import { NEXT_PUBLIC_AI_URL } from "../../../config/client";
import { Sql } from "../db";

import { getBackingTags } from "./getBackingTags";

import { httpPostTagsRecommendation } from "@/modules/ai/api/httpPostTagsRecommendation";

export type Params = { projectId: string; relevantAddress: Address };

type Response = { match: number | undefined };

export async function getProjectMatch(
  sql: Sql,
  { projectId, relevantAddress }: Params
): Promise<Response> {
  const result = await sql`
    SELECT
      pi.tags
    FROM
      chain.project_detail pd
      INNER JOIN ipfs.project_info pi ON pd.information_cid = pi.cid
      INNER JOIN chain.output o ON pd.id = o.id
    WHERE
      o.spent_slot IS NULL
      AND pd.project_id = ${projectId}
      AND NOT EXISTS (SELECT FROM admin.blocked_project bp WHERE bp.project_id = pd.project_id)
    LIMIT
      1
  `;

  const { tags: targetTag } = await getBackingTags(sql, { relevantAddress });
  const [{ tags }] = result;
  const listTags = [tags.map((tag: string) => tag)];

  const { recommend } = await httpPostTagsRecommendation({
    baseUrl: NEXT_PUBLIC_AI_URL,
    targetTag,
    listTags,
  });

  return { match: recommend[0] };
}

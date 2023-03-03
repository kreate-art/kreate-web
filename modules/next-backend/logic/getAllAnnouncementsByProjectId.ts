import { Sql } from "../db";
import { MODERATION_TAGS } from "../types";
import { CodecCid } from "../utils/CodecCid";

import { isNotNullOrUndefined } from "@/modules/array-utils";
import { ProjectAnnouncement } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";

type Cid = string;

type Params = {
  projectId: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWithBufsAs<T, V>(obj: any): obj is WithBufsAs<T, V> {
  return typeof obj?.data === "object" && typeof obj?.bufs === "object";
}

export async function getAllAnnouncementsByProjectId(
  sql: Sql,
  { projectId }: Params
): Promise<ProjectAnnouncement[]> {
  const rows = await sql`
    SELECT a.announcement_cid, bk.time, pa.data, pm.*
    FROM
      (SELECT * FROM
        (
          SELECT id, project_id, last_announcement_cid AS announcement_cid, lag(last_announcement_cid)
            OVER (ORDER BY id)
            AS prev_announcement_cid
            FROM chain.project_detail
            WHERE project_id = ${projectId}
        ) _a
        WHERE announcement_cid IS DISTINCT FROM prev_announcement_cid
      ) AS a
      INNER JOIN chain.output o ON a.id = o.id
      INNER JOIN chain.block bk ON o.created_slot = bk.slot
      INNER JOIN ipfs.project_announcement pa ON a.announcement_cid = pa.cid
      LEFT JOIN ai.project_moderation pm ON a.announcement_cid = pm.cid
    WHERE
      NOT EXISTS (SELECT FROM admin.blocked_project bp WHERE bp.project_id = ${projectId})
    ORDER BY bk.slot DESC;
  `;
  return rows
    .map((row) => {
      try {
        assert(isWithBufsAs<ProjectAnnouncement, Cid>(row.data));
        const projectAnnouncements = Converters.toProjectCommunityUpdate(
          CodecCid
        )(row.data);
        projectAnnouncements.announcementCid = row.announcementCid;
        projectAnnouncements.createdAt = row.time?.valueOf();
        const censorship = MODERATION_TAGS.filter((t) => row[t]);
        projectAnnouncements.censorship = censorship;
        return projectAnnouncements;
      } catch (error) {
        return undefined;
      }
    })
    .filter(isNotNullOrUndefined);
}

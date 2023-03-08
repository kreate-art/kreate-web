import { Address, UnixTime } from "lucid-cardano";

import { Sql } from "../db";
import { MODERATION_TAGS } from "../types";
import { CodecCid } from "../utils/CodecCid";

import { try$ } from "@/modules/async-utils";
import { Podcast, Project } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";

type Cid = string;

export type Params = {
  backedBy?: Address;
  createdSince?: UnixTime;
  createdBefore?: UnixTime;
};

export type AllPodcasts = Podcast[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWithBufsAs<T, V>(obj: any): obj is WithBufsAs<T, V> {
  return typeof obj?.data === "object" && typeof obj?.bufs === "object";
}

export async function getAllPodcasts(
  sql: Sql,
  { backedBy, createdSince, createdBefore }: Params
) {
  const results = await sql`
    SELECT
      pd.project_id as pid,
      pi.contents,
      pod.cid,
      pod.completed_at,
      (pa.data -> 'data' -> 'title') as title,
      pm.*
    FROM
      ai.podcast pod
    INNER JOIN
      chain.project_detail pd
    -- TODO: @sk-shishi: Have a subquery for ai.podcast joining chain.project_detail
    -- that pre-filters duplicated project_detail rows
    ON
      pd.id = (
        SELECT
          MIN(id)
        FROM
          chain.project_detail
        WHERE
          last_announcement_cid = pod.cid
      )
    INNER JOIN
      views.project_summary ps
    ON
      ps.project_id = pd.project_id
    INNER JOIN
      ipfs.project_info pi
    ON
      pd.information_cid = pi.cid
    INNER JOIN
      ipfs.project_announcement pa
    ON
      pa.cid = pod.cid
    INNER JOIN
      ai.project_moderation pm
    ON
      pm.cid = pod.cid
    WHERE
      pod.error IS NULL
      AND ${
        backedBy
          ? sql`EXISTS (
              SELECT
                FROM
                  chain.backing b
                INNER JOIN
                  chain.output o
                ON
                  o.id = b.id
                WHERE
                  o.spent_slot IS NULL
                  AND b.backer_address = ${backedBy}
                  AND b.project_id = pd.project_id
            )`
          : sql`TRUE`
      }
      AND ${createdSince ? sql`pod.completed_at >= ${createdSince}` : sql`TRUE`}
      AND ${
        createdBefore ? sql`pod.completed_at < ${createdBefore}` : sql`TRUE`
      }
    ORDER BY
      ps.total_backing_amount DESC, ps.backer_count DESC, pd.id DESC
  `;

  return await Promise.all(
    results.map(async (row, index) => {
      const { basics: pbasics } = await try$<Partial<Project>>(
        () => {
          assert(isWithBufsAs<Project, Cid>(row.contents));
          return Converters.toProject(CodecCid)(row.contents);
        },
        () => ({})
      );

      const censorship = MODERATION_TAGS.filter((t) => row[t]);

      return {
        id: index,
        pid: row.pid,
        pbasics,
        cid: row.cid,
        title: row.title,
        completedAt: row.completedAt,
        censorship,
      };
    })
  );
}

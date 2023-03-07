import { Cid } from "@teiki/protocol/types";

import { Sql } from "../db";
import { CodecCid } from "../utils/CodecCid";

import { range } from "@/modules/array-utils";
import {
  LovelaceAmount,
  Project,
  ProjectBasics,
  ProjectUpdateScope,
  PROJECT_UPDATE_SCOPE,
  UnixTimestamp,
} from "@/modules/business-types";
import { toJson } from "@/modules/json-utils";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";

export type ProjectUpdate = {
  time: UnixTimestamp;
  scope: ProjectUpdateScope[];
};

type SqlProjectSnapshot = {
  informationCid: string;
  time: Date;
  contents: WithBufsAs<Project, Cid>;
  sponsorshipAmount?: LovelaceAmount;
  sponsorshipUntil?: Date;
};

type ProjectSnapshot = {
  time: UnixTimestamp;
  contents: Project;
  sponsorshipAmount?: LovelaceAmount;
  sponsorshipUntil?: UnixTimestamp;
};

type Params = {
  projectId: string;
};

export async function getAllProjectUpdates(
  sql: Sql,
  { projectId }: Params
): Promise<ProjectUpdate[]> {
  const results = await sql<SqlProjectSnapshot[]>`
    SELECT
      a.information_cid,
      bk.time,
      pi.contents,
      a.sponsorship_amount,
      a.sponsorship_until
    FROM (
      SELECT
        *
      FROM (
        SELECT
          id,
          project_id,
          information_cid,
          LAG(information_cid) OVER w AS prev_information_cid,
          sponsorship_amount,
          LAG(sponsorship_amount) OVER w AS prev_sponsorship_amount,
          sponsorship_until,
          LAG(sponsorship_until) OVER w AS prev_sponsorship_until
        FROM chain.project_detail
        WHERE project_id = ${projectId}
        WINDOW w AS (ORDER BY id)
      ) _a
      WHERE
        information_cid IS DISTINCT FROM prev_information_cid
          OR sponsorship_until IS DISTINCT FROM prev_sponsorship_until
          OR sponsorship_amount IS DISTINCT FROM prev_sponsorship_amount
    ) AS a
    INNER JOIN chain.output o ON a.id = o.id
    INNER JOIN chain.block bk ON o.created_slot = bk.slot
    INNER JOIN ipfs.project_info pi ON a.information_cid = pi.cid
    ORDER BY bk.slot DESC
  `;

  const allProjectSnapshots: ProjectSnapshot[] = results.map((result) => {
    const contents = Converters.toProject(CodecCid)(result.contents);
    return {
      time: result.time?.valueOf(),
      contents,
      sponsorshipAmount: result.sponsorshipAmount,
      sponsorshipUntil: result.sponsorshipUntil?.valueOf(),
    };
  });

  // console.log(allProjectSnapshots);

  const allProjectUpdates: ProjectUpdate[] = range(
    allProjectSnapshots.length - 1
  ).map((i) => {
    return {
      time: allProjectSnapshots[i].time,
      scope: getAllUpdatedScopes(
        allProjectSnapshots[i].contents,
        allProjectSnapshots[i + 1].contents,
        allProjectSnapshots[i].sponsorshipAmount,
        allProjectSnapshots[i + 1].sponsorshipAmount,
        allProjectSnapshots[i].sponsorshipUntil,
        allProjectSnapshots[i + 1].sponsorshipUntil
      ),
    };
  });

  return allProjectUpdates;
}

function getAllUpdatedScopes(
  a: Project,
  b: Project,
  a$Amount?: LovelaceAmount,
  b$Amount?: LovelaceAmount,
  a$Until?: UnixTimestamp,
  b$Until?: UnixTimestamp
): ProjectUpdateScope[] {
  const results: ProjectUpdateScope[] = [];
  for (const [key, value] of Object.entries(a)) {
    if (key === "roadmap") continue; // TODO: @sk-umiuma: remove this when types are normalized
    if (key === "description" || key === "community") {
      if (toJson(value) !== toJson(b[key])) results.push({ type: key });
    } else {
      for (const [keyBasics, valueBasics] of Object.entries(a.basics)) {
        if (
          toJson(valueBasics) !==
            toJson(b.basics[keyBasics as keyof ProjectBasics]) &&
          PROJECT_UPDATE_SCOPE.includes(keyBasics as keyof ProjectBasics)
        )
          results.push({ type: keyBasics as keyof ProjectBasics });
      }
    }
  }
  if (a$Amount != null && (a$Amount !== b$Amount || a$Until !== b$Until)) {
    results.push({ type: "sponsorship", sponsorshipAmount: a$Amount });
  }
  return results;
}

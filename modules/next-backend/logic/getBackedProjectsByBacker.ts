import { Sql } from "../db";

import { Project } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { WithBufsAs } from "@/modules/with-bufs-as";

type Cid = string;

type Params = {
  address: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isProject(obj: any): obj is Project {
  return (
    typeof obj?.description === "object" &&
    typeof obj?.basics === "object" &&
    Array.isArray(obj?.roadmap) &&
    typeof obj?.community === "object"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWithBufsAs$Project$Cid(obj: any): obj is WithBufsAs<Project, Cid> {
  return (
    typeof obj?.data === "object" &&
    isProject(obj?.data) &&
    typeof obj?.bufs === "object" &&
    Object.values(obj?.bufs).every((buf) => typeof buf === "string")
  );
}

export async function getBackedProjectsByBacker(sql: Sql, { address }: Params) {
  const rowList = await sql`
    WITH
    x_unspent_project AS (
    SELECT
      pd.project_id project_id,
      pd.information_cid information_cid,
      pi.contents contents
    FROM
      chain.project_detail pd
    INNER JOIN ipfs.project_info pi ON
      pi.cid = pd.information_cid
    INNER JOIN chain.output o ON
      pd.id = o.id
    WHERE
      o.spent_slot IS NULL
    ),
    x_all_backings_by_user AS (
      SELECT
        b.project_id,
        COALESCE(SUM(b.backing_amount) FILTER (WHERE o.spent_slot IS NULL), 0)::bigint AS total_backing_amount_by_user,
        bool_or(o.spent_slot IS NULL) AS is_currently_backing
      FROM
        chain.backing b
      INNER JOIN chain.output o ON
        b.id = o.id
      WHERE
        b.backer_address = ${address}
      GROUP BY
        b.project_id
    )
    SELECT
      xup.project_id project_id,
      xup.information_cid information_cid,
      xup.contents contents,
      xabbu.total_backing_amount_by_user total_backing_amount_by_user,
      xabbu.is_currently_backing
    FROM
      x_unspent_project xup
    INNER JOIN x_all_backings_by_user xabbu
    ON xup.project_id = xabbu.project_id
    WHERE
      NOT EXISTS (SELECT FROM admin.blocked_project bp WHERE bp.project_id = xup.project_id)
    ORDER BY xabbu.total_backing_amount_by_user DESC
  `;

  const rows = rowList.map((row) => {
    // We will need to classify which projects the user
    // is backing to limit the timeline on UI.
    const {
      projectId,
      contents,
      totalBackingAmountByUser,
      isCurrentlyBacking,
    } = row;
    assert(
      typeof projectId === "string" &&
        typeof contents === "object" &&
        isWithBufsAs$Project$Cid(contents) &&
        typeof totalBackingAmountByUser === "bigint" &&
        typeof isCurrentlyBacking === "boolean"
    );
    return {
      projectId,
      contents,
      totalBackingAmountByUser,
      isCurrentlyBacking,
    };
  });

  return rows;
}

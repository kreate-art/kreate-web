import Cid from "../../../pages/api/v1/exclusive/decrypt/ipfs/[cid]";
import { Sql } from "../db";
import { MODERATION_TAGS } from "../types";
import { CodecCid } from "../utils/CodecCid";

import { getTotalStakedByBacker } from "./getTotalStakedByBacker";

import { isNotNullOrUndefined } from "@/modules/array-utils";
import {
  Address,
  AnyProjectPost,
  ExclusiveProjectPost,
  EXCLUSIVE_TIERS,
  PublicProjectPost,
} from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { CipherMeta } from "@/modules/crypt/types";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";
import { decryptExclusivePost } from "@/modules/with-bufs-as-converters/converters/exclusive-post";

type Cid = string;

type Params = {
  projectId: string;
  ownerAddress: Address;
  viewerAddress: Address | null;
};

function isProjectPublicPost<PublicProjectPost, V>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any
): obj is WithBufsAs<PublicProjectPost, V> {
  return (
    typeof obj?.data === "object" &&
    typeof obj?.bufs === "object" &&
    !obj.data.exclusive
  );
}

function isProjectExclusivePost<ExclusiveProjectPost, V>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any
): obj is WithBufsAs<ExclusiveProjectPost, V> {
  return (
    typeof obj?.data === "object" &&
    typeof obj?.bufs === "object" &&
    !!obj.data.exclusive
  );
}

export async function getAllPostsByProjectId(
  sql: Sql,
  { projectId, ownerAddress, viewerAddress }: Params
): Promise<AnyProjectPost[]> {
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

  const tier = await getViewerTier(sql, viewerAddress, ownerAddress, projectId);
  return rows
    .map((row) => {
      try {
        const isExclusive = isProjectExclusivePost<
          ExclusiveProjectPost,
          CipherMeta & { cid: Cid }
        >(row.data);
        assert(
          isProjectPublicPost<PublicProjectPost, Cid>(row.data) || isExclusive
        );

        const anyProjectAnnouncement = isExclusive
          ? decryptExclusivePost(row.data, tier)
          : Converters.toProjectCommunityUpdate(CodecCid)(row.data);
        anyProjectAnnouncement.announcementCid = row.announcementCid;
        anyProjectAnnouncement.createdAt = row.time?.valueOf();
        const censorship = MODERATION_TAGS.filter((t) => row[t]);
        anyProjectAnnouncement.censorship = censorship;
        return anyProjectAnnouncement;
      } catch (error) {
        return undefined;
      }
    })
    .filter(isNotNullOrUndefined);
}

async function getViewerTier(
  sql: Sql,
  viewerAddress: Address | null,
  ownerAddress: Address,
  projectId: string
) {
  if (!viewerAddress) return null;
  if (viewerAddress === ownerAddress) return 999_999; // A very big number
  const viewerActiveStakingAmount = await getTotalStakedByBacker(sql, {
    backerAddress: viewerAddress,
    projectId,
  });

  return fromActiveStakingAmountToTier(viewerActiveStakingAmount.amount);
}

function fromActiveStakingAmountToTier(asa: bigint) {
  const tiers = EXCLUSIVE_TIERS.filter((tier) => tier.requiredStake <= asa).map(
    (tier) => tier.tier
  );
  return tiers.length ? Math.max(...tiers) : null;
}

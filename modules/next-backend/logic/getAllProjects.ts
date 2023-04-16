import { Address } from "lucid-cardano";

import { Sql } from "../db";
import { MODERATION_TAGS } from "../types";
import { CodecCid } from "../utils/CodecCid";

import { getBackingTags } from "./getBackingTags";

import { sortedBy } from "@/modules/array-utils";
import { Project, ProjectGeneralInfo } from "@/modules/business-types";
import {
  Query,
  toBoolean,
  toEnum,
  toInteger,
  toString,
} from "@/modules/query-utils";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";

type Params = {
  active?: boolean;
  category?: "featured" | "sponsor" | "top" | "relevant";
  searchQuery?: string;
  searchMethod?: "prefix" | "fts"; // fts is full-text search
  tags?: string[];
  relevantAddress?: Address;
  offset?: number;
  limit?: number;
};

export type GetAllProjects$Params = Params;

type Response = {
  projects: ProjectGeneralInfo[];
  hasMore?: boolean;
};

export type GetAllProjects$Response = Response;

type Cid = string;

/**
 * TODO: @sk-umiuma:
 * Tags search is case-sensitive
 * FIXME: @sk-umiuma:
 * Let's say we are on page `n`, and there is a project on page `n+1`.
 * If this project gets a significant amount of stake, the next query
 * to page `n+1` will no longer contains that project, and users will
 * no longer be able to see the project unless they refresh the page.
 */
export async function getAllProjects(
  sql: Sql,
  {
    active,
    category,
    searchQuery,
    searchMethod,
    tags,
    relevantAddress,
    offset,
    limit,
  }: Params
): Promise<Response> {
  const sqlActiveStatus =
    active === undefined
      ? sql`TRUE`
      : active
      ? sql`p.status = 'active'`
      : sql`p.status in ('delisted', 'closed')`;
  const sqlCategoryFeatured =
    category !== "featured"
      ? sql`TRUE`
      : sql`EXISTS (SELECT FROM admin.featured_project fp WHERE fp.project_id = d.project_id)`;
  const sqlCategorySponsor =
    category !== "sponsor"
      ? sql`TRUE`
      : sql`d.sponsorship_until IS NOT NULL AND d.sponsorship_until > current_timestamp`;
  const sqlTagsFilter =
    tags === undefined ? sql`TRUE` : sql`${tags} && pi.tags`;
  const sqlSearchQuery = searchQuery
    ? searchMethod === "prefix"
      ? sql`LOWER(pi.title) LIKE LOWER(${`${searchQuery}%`})`
      : sql`
          ( SELECT
            setweight(to_tsvector('simple', COALESCE(pi.title, '')), 'A')
              || setweight(to_tsvector('simple', COALESCE(pi.slogan, '')), 'B')
              || setweight(array_to_tsvector(pi.tags), 'B')
              || setweight(to_tsvector('simple', COALESCE(pi.summary, '')), 'C')
              || setweight(to_tsvector('simple', COALESCE(pi.custom_url, '')), 'C')
              || setweight(to_tsvector('simple', COALESCE(po.project_ocr, '')), 'C')
          ) @@ phraseto_tsquery('simple', ${searchQuery})
      `
    : sql`TRUE`;
  const sqlOffset = !offset ? sql`` : sql`OFFSET ${offset}`;
  const sqlLimit = !limit ? sql`` : sql`LIMIT ${limit + 1}`;

  const sqlBase = sql`
    SELECT
      pi.contents,
      pi.cid,
      s.*,
      (
        SELECT
          MAX(b.time) AS closed_time
        FROM
          chain.project p
          INNER JOIN chain.OUTPUT o ON p.id = o.id
          INNER JOIN chain.block b ON o.created_slot = b.slot
        WHERE
          o.spent_slot IS NULL
          AND p.project_id = d.project_id
          AND p.status in ('delisted', 'closed')
        LIMIT
          1
      ),
      pcm.*
    FROM  VIEWS.project_summary s
    INNER JOIN chain.project_detail d ON s.project_id = d.project_id
    INNER JOIN
      (
        SELECT p.* FROM chain.project p
        INNER JOIN chain.output o ON p.id = o.id
        WHERE
         o.spent_slot IS NULL
      ) as p ON p.project_id = d.project_id
    INNER JOIN ipfs.project_info pi ON pi.cid = d.information_cid
    INNER JOIN chain.output o ON d.id = o.id
    LEFT JOIN ai.project_moderation pcm ON pi.cid = pcm.cid
    LEFT JOIN
      (
        SELECT pm.project_cid cid, STRING_AGG(ocr.text, ' ') project_ocr
        FROM ipfs.project_media pm
        LEFT JOIN ai.ocr ocr ON pm.media_cid = ocr.media_cid
        GROUP BY pm.project_cid
      ) po on pi.cid = po.cid
    WHERE
      o.spent_slot is NULL
      AND ${sqlCategoryFeatured}
      AND ${sqlActiveStatus}
      AND ${sqlTagsFilter}
      AND ${sqlSearchQuery}
      AND ${sqlCategorySponsor}
      AND NOT EXISTS (SELECT FROM admin.blocked_project bp WHERE bp.project_id = p.project_id)
  `;

  let targetTag: string[] = [];
  if (relevantAddress !== undefined) {
    const { tags } = await getBackingTags(sql, { relevantAddress });
    targetTag = tags;
  }

  /**
   * 1. We only use limit and offset when relevantAddress is not
   * set, as projects must be sorted by relevance before offset being
   * applied
   * 2. Recommends top projects for wallets without any backing
   */
  const results = await (category === "relevant" && targetTag.length > 0
    ? sqlBase
    : sql`
      ${sqlBase}
      ${
        category === "sponsor"
          ? sql`ORDER BY s.sponsorship_amount DESC, s.total_backing_amount DESC, s.backer_count DESC, o.id ASC`
          : sql`ORDER BY s.total_backing_amount DESC, s.backer_count DESC, o.id ASC`
      }
      ${sqlOffset}
      ${sqlLimit}
  `);

  let projects: ProjectGeneralInfo[] = results
    .filter(({ contents }) => isWithBufsAs<Project, Cid>(contents))
    .map((p) => {
      const project = Converters.toProject(CodecCid)(p.contents);
      return {
        id: p.projectId,
        basics: project.basics,
        community: project.community,
        history: {
          createdAt: p.createdTime,
          updatedAt: p.lastUpdatedTime,
          // FIXME: @sk-umiuma: This value is actually the
          // closed/delisted time of the project
          closedAt: p.closedTime,
          delistedAt: undefined,
        },
        stats: {
          numSupporters: p.backerCount,
          numLovelacesStaked: p.totalStakingAmount,
          numLovelaceWithdrawn: p.withdrawnFunds,
          numLovelacesAvailable: p.availableFunds,
          numLovelacesRaised: p.totalRaisedFunds,
        },
        categories: { featured: p.featured },
        censorship: MODERATION_TAGS.filter((t) => p[t]),
        sponsorshipAmount: p.sponsorshipAmount,
      };
    });

  let hasMore: boolean | undefined = undefined;

  if (category === "relevant" && targetTag.length > 0) {
    projects = sortedBy(projects, (item) => -(item.match ?? 0)).splice(
      offset ?? 0,
      limit ? limit + 1 : projects.length
    );
  }

  hasMore = limit ? projects.length > limit : undefined;
  if (hasMore) projects.pop();

  return { projects, hasMore };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWithBufsAs<T, V>(obj: any): obj is WithBufsAs<T, V> {
  return typeof obj?.data === "object" && typeof obj?.bufs === "object";
}

export function toQuery$GetAllProjects(params: Params): Query {
  return {
    active: params.active?.toString(),
    category: params.category,
    searchQuery: params.searchQuery,
    searchMethod: params.searchMethod,
    tags_commaSeparated: params.tags?.join(","),
    offset: params.offset?.toString(),
    limit: params.limit?.toString(),
    relevantAddress: params.relevantAddress,
  };
}

export function fromQuery$GetAllProjects(query: Query): Params {
  return {
    active: toBoolean(query.active),
    category: toEnum(
      query.category, //
      ["featured", "sponsor", "top", "relevant"]
    ),
    searchQuery: toString(query.searchQuery),
    searchMethod: toEnum(query.searchMethod, ["prefix", "fts"]),
    tags: toString(query.tags_commaSeparated)?.split(","),
    relevantAddress: toString(query.relevantAddress),
    offset: toInteger(query.offset),
    limit: toInteger(query.limit),
  };
}

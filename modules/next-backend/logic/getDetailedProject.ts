import { JSONContent } from "@tiptap/core";

import { Sql } from "../db";
import { MODERATION_TAGS } from "../types";
import { CodecCid } from "../utils/CodecCid";

import { getActiveTierMember } from "./getActiveTierMember";
import { getAllPostsByProjectId } from "./getAllPostsByProjectId";
import { getAllProjectMilestoneSnapshots } from "./getAllProjectMilestoneSnapshots";
import { getAllProjectUpdates } from "./getAllProjectUpdates";
import {
  getBackingActivities,
  ProjectBackingActivity,
} from "./getBackingActivitiesByProjectId";
import { getBackingTags } from "./getBackingTags";
import { getProjectCreationActivity } from "./getProjectCreationActivity";
import { getTopSupporter } from "./getTopSupporter";

import { httpPostContentModeration } from "@/modules/ai/api/httpPostContentModeration";
import { httpPostTagsRecommendation } from "@/modules/ai/api/httpPostTagsRecommendation";
import { try$ } from "@/modules/async-utils";
import { AuthHeader } from "@/modules/authorization";
import {
  DetailedProject,
  Project,
  ProjectActivity,
  ProjectActivityAction,
  ProjectBenefitsTier,
  ProjectId,
} from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";

const ERRORS = {
  NOT_FOUND: 48,
} as const;

export const GET_DETAILED_PROJECT__ERRORS = ERRORS;

type Cid = string;

type Params = {
  active?: boolean;
  customUrl?: string;
  projectId?: string;
  ownerAddress?: string;
  relevantAddress?: string;
  preset: "minimal" | "basic" | "full";
  authHeader?: AuthHeader | undefined;
};

export type GetDetailedProject$Params = Params;

type Response =
  | { error?: undefined; project: DetailedProject }
  | { error: typeof ERRORS.NOT_FOUND; _debug?: unknown };

export type GetDetailedProject$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWithBufsAs<T, V>(obj: any): obj is WithBufsAs<T, V> {
  return typeof obj?.data === "object" && typeof obj?.bufs === "object";
}

// When calculating average update time for
// closed projects, should the time range end
// be the closed time or the current time?
export async function getDetailedProject(
  sql: Sql,
  params: Params
): Promise<Response> {
  assert(
    params.customUrl || params.projectId || params.ownerAddress,
    "at least one filter is required"
  );
  const sqlBase = sql`
    SELECT
      (
        SELECT
          max(b.time) AS project_closed_time
        FROM
          chain.project p
          INNER JOIN chain.output o ON p.id = o.id
          INNER JOIN chain.block b ON o.created_slot = b.slot
        WHERE
          o.spent_slot IS NULL
          AND p.project_id = d.project_id
          AND p.status in ('delisted', 'closed')
          AND NOT EXISTS (SELECT FROM admin.blocked_project bp WHERE bp.project_id = p.project_id)
        LIMIT
          1
      ),
      (
        SELECT
          EXTRACT (
            EPOCH
            FROM
              (current_timestamp - ps.created_time)
          ) / (
            COUNT (DISTINCT pd.last_announcement_cid) + 1
          ) * 1000 AS average_milliseconds_between_project_updates
        FROM
          chain.project_detail pd
          INNER JOIN views.project_summary ps ON pd.project_id = ps.project_id
        WHERE
          pd.project_id = d.project_id
        GROUP BY
          ps.created_time
        LIMIT
          1
      ),
      (
        SELECT
          project_id is not null as is_featured
        FROM
          admin.featured_project
        WHERE
          project_id = d.project_id
      ),
      d.project_id,
      d.sponsorship_until,
      pi.contents,
      s.*,
      pcm.*
    FROM
      chain.project_detail d
    INNER JOIN chain.output o
      ON d.id = o.id
    INNER JOIN ipfs.project_info pi
      ON d.information_cid = pi.cid
    INNER JOIN views.project_summary s
      ON s.project_id = d.project_id
    INNER JOIN
      (
        SELECT p.* FROM chain.project p
        INNER JOIN chain.output o ON p.id = o.id
        WHERE
          o.spent_slot IS NULL
      ) as p ON p.project_id = d.project_id
    LEFT JOIN ai.project_moderation pcm
      ON d.information_cid = pcm.cid
  `;

  const sqlProjectIdMatch = params.projectId
    ? sql`d.project_id = ${params.projectId}`
    : sql`TRUE`;
  const sqlOwnerAddressMatch = params.ownerAddress
    ? sql`s.owner_address = ${params.ownerAddress}`
    : sql`TRUE`;
  const sqlActiveStatus =
    params.active === undefined
      ? sql`TRUE`
      : params.active
      ? sql`p.status = 'active'`
      : sql`p.status in ('delisted', 'closed')`;
  const results = await (params.customUrl
    ? sql`
        ${sqlBase}
        INNER JOIN views.project_custom_url mapping
          ON mapping.project_id = d.project_id
        WHERE
          mapping.custom_url = ${params.customUrl}
          AND ${sqlProjectIdMatch}
          AND ${sqlOwnerAddressMatch}
          AND ${sqlActiveStatus}
        ORDER BY
          o.created_slot DESC
        LIMIT 1
      `
    : sql`
        ${sqlBase}
        WHERE
          ${sqlProjectIdMatch}
          AND ${sqlOwnerAddressMatch}
          AND ${sqlActiveStatus}
        ORDER BY
          o.created_slot DESC
          LIMIT 1
      `);

  const row = results[0];

  if (!row) {
    return { error: ERRORS.NOT_FOUND };
  }

  const {
    projectId,
    sponsorshipUntil,
    sponsorshipAmount,
    isFeatured,
    contents,
    createdTime,
    lastUpdatedTime,
    // @sk-yagi: Comment out for now, we havent use this yet.
    // totalBackingAmount,
    // @sk-yagi: This field indicates total ADA amount
    // used to generate staking rewards for project,
    // including `totalBackingAmount` from backers as well as
    // all ADA in project-related UTxOs. This matches `Active stake` on UI
    totalStakingAmount,
    backerCount,
    ownerAddress,
    projectClosedTime,
    averageMillisecondsBetweenProjectUpdates,
    withdrawnFunds,
    availableFunds,
    totalRaisedFunds,
  } = row;

  const { description, basics, roadmap, tiers, community } = await try$<
    Partial<Project>
  >(
    () => {
      assert(isWithBufsAs<Project, Cid>(contents));
      return Converters.toProject(CodecCid)(contents);
    },
    () => ({})
  );

  const project: DetailedProject = {
    id: projectId,
  };

  if (params.preset === "basic" || params.preset === "full") {
    Object.assign(project, {
      basics,
      community,
      history: {
        createdBy: ownerAddress,
        createdAt: createdTime,
        updatedAt: lastUpdatedTime,
        closedAt: projectClosedTime,
        // FIXME: @sk-umiuma: Wait for delist index
        delistedAt: undefined,
      },
      stats: {
        numSupporters: backerCount,
        numLovelacesStaked: totalStakingAmount,
        numLovelaceWithdrawn: withdrawnFunds,
        numLovelacesAvailable: availableFunds,
        numLovelacesRaised: totalRaisedFunds,
        averageMillisecondsBetweenProjectUpdates,
      },
      categories: {
        featured: isFeatured,
        sponsor: sponsorshipUntil >= Date.now(),
      },
      censorship: MODERATION_TAGS.filter((t) => row[t]),
      sponsorshipAmount,
      sponsorshipUntil,
    });
  }

  if (params.preset === "full") {
    const [
      announcements,
      { backingData },
      projectUpdates,
      allProjectProtocolMilestoneSnapshots,
      topSupporters,
      projectCreation,
      tiersActiveMember,
    ] = await Promise.all([
      // TODO: Use `getAllActivities` instead
      getAllPostsByProjectId(sql, {
        projectId,
        viewerAddress: params.authHeader?.address ?? null,
        ownerAddress,
        tiers: tiers ?? [],
      }),
      // TODO: @sk-umiuma: implement these
      getBackingActivities(sql, {
        projectId,
      }),
      getAllProjectUpdates(sql, {
        projectId,
      }),
      getAllProjectMilestoneSnapshots(sql, {
        projectId,
      }),
      getTopSupporter(sql, { projectId }),
      getProjectCreationActivity(sql, { projectId }),
      getActiveTierMember(sql, { projectId }),
    ]);

    const activities = await backingDataToActivities(backingData);
    // Announcement
    announcements.forEach((announcement) => {
      const action: ProjectActivityAction = {
        type: "announcement",
        projectTitle: project.basics?.title ?? ownerAddress,
        title: announcement.title,
        message: null, // @sk-yagi: For now there's no message when project post announcement
      };
      // TODO: @sk-yagi: Index correct time
      const createdAt = announcement.createdAt ?? 1672506000000; // 1/1/2023, 12:00:00 AM
      activities.push({
        createdAt,
        createdBy: ownerAddress,
        action,
      });
    });

    // Project Update
    projectUpdates.forEach((update) => {
      const action: ProjectActivityAction = {
        type: "project_update",
        projectTitle: project.basics?.title ?? ownerAddress,
        scope: update.scope,
        message: null, // @sk-yagi: For now there's no message when project update
      };
      activities.push({
        createdAt: update.time,
        createdBy: ownerAddress,
        action,
      });
    });

    // Protocol milestones
    allProjectProtocolMilestoneSnapshots.forEach((snapshot) => {
      const action: ProjectActivityAction = {
        type: "protocol_milestone_reached",
        projectTitle: project.basics?.title ?? ownerAddress,
        milestonesSnapshot: snapshot.milestoneReached,
        message: null, // @sk-yagi: For now there's no message when project reached protocol milestone
      };
      activities.push({
        createdAt: snapshot.time,
        createdBy: ownerAddress,
        action,
      });
    });

    if (projectCreation.error !== "no-project-found") {
      const action: ProjectActivityAction = {
        type: "project_creation",
        projectTitle: project.basics?.title ?? ownerAddress,
        sponsorshipAmount: projectCreation.sponsorshipAmount,
        message: null,
      };
      activities.push({
        createdAt: projectCreation.createdAt,
        createdBy: ownerAddress,
        action,
      });
    }

    const match: number | undefined = undefined;

    const fallbackTier = fallbackTiers.get(projectId);
    const tiers$Fallback: ProjectBenefitsTier[] =
      tiers != null
        ? tiers
        : fallbackTier == null
        ? []
        : [
            {
              id: "default",
              title: "Fan",
              contents: { body: fallbackTier },
              requiredStake: 5_000_000,
              benefits: [],
              maximumMembers: null,
            },
          ];
    const tiersWithActiveMemberCount = tiers$Fallback.map((tier) => ({
      ...tier,
      activeMemberCount: tiersActiveMember.find(
        (value) => value.tierId === tier.id
      )?.totalActiveMember,
    }));

    Object.assign(project, {
      description,
      roadmap,
      announcements,
      tiers: tiersWithActiveMemberCount,
      activities,
      topSupporters,
      match,
    });
  }

  return { error: undefined, project };
}

async function backingDataToActivities(
  backingData: ProjectBackingActivity[]
): Promise<ProjectActivity[]> {
  const activities: ProjectActivity[] = [];
  await Promise.all(
    backingData.map(async (data) => {
      const message$ModeratedTags: string[] = [];

      const action: ProjectActivityAction = {
        type: data.action,
        createdBy: data.actor,
        lovelaceAmount: data.amount,
        message: data.message,
        message$ModeratedTags,
        createdTx: data.txId,
      };
      activities.push({
        createdAt: data.time,
        createdBy: data.actor,
        action,
      });
    })
  );
  return activities;
}

const kikai$Benefits = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Members staking at least 1000 ADA for a year will get early access to the game when it is restarted (TBD).",
          type: "text",
        },
      ],
    },
  ],
};

const shinkaNetwork$Benefits = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Members staking 10,000 ADA for three years can request a product for us to build. You can keep requesting until we agree on something plausible, as we cannot build a rocket in three years!",
          type: "text",
        },
      ],
    },
  ],
};

const fatCats$Benefits = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Supporters of Fat Cats that have staked towards the project via Teiki will receive one or more of the following:",
          type: "text",
        },
      ],
    },
    { type: "paragraph", attrs: { textAlign: "left" } },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "• Whitelist spot or spots",
          type: "text",
          marks: [
            { type: "bold" },
            { type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "• Private Zeppelin",
          type: "text",
          marks: [{ type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "• Private Train Cart",
          type: "text",
          marks: [{ type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "• Royal Card",
          type: "text",
          marks: [{ type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } }],
        },
        { type: "hardBreak" },
        {
          type: "hardBreak",
          marks: [{ type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } }],
        },
        {
          text: "• $DUCATS tokens",
          type: "text",
          marks: [{ type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "• Other rewards",
          type: "text",
          marks: [{ type: "textStyle", attrs: { color: "rgb(0, 0, 0)" } }],
        },
      ],
    },
  ],
};

const demuPro$Benefits = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1, textAlign: "left" },
      content: [{ text: "Benefits", type: "text" }],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "After we hit our fundraising goal, 500,000 $DEMU tokens will be distributed to all supporters of DEMU, in proportion to the amount supported. The tokens will be airdropped. This is currently the only way to obtain $DEMU tokens. ",
          type: "text",
        },
      ],
    },
  ],
};

const opshin$Benefits = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1, textAlign: "left" },
      content: [
        {
          text: "Subscribe to OpShin!",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Monthly subscription options for OpShin are coming soon to the platform!",
          type: "text",
          marks: [{ type: "italic" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Stake the following minimum amounts to get these benefits:",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [
        {
          text: "Python Pal - 15 ADA/month (250 ADA Stake)",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Thank you for supporting OpShin and your fellow Python Pals on Cardano! You get:",
          type: "text",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "Patron",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: " role in Discord", type: "text" },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [
        {
          text: "Anacondas for ADA - 60 ADA/month (1,000 ADA Stake)",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "ADA development for all! Thank you for supporting OpShin and your fellow Python Pals on Cardano! You get:",
          type: "text",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Patron role in Discord", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "Mention in the release notes",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [
        {
          text: "Cobra Commander - 90 ADA/month (1,500 ADA Stake)",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "For the serious sneks in our ecosystem. Maximize the value you get out of our toolchain by educating yourself! Get this tier and you get:",
          type: "text",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Patron role in Discord", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Mention in the release notes", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "Access to Udemy course upon release",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [
        {
          text: "King Snake - 240 ADA/month (3,995 ADA Stake)",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "You can build without limits, but it’s still easier not to build alone. Learn from the best so you can build ",
          type: "text",
        },
        { text: "your", type: "text", marks: [{ type: "italic" }] },
        { text: " best. Get this tier and you get:", type: "text" },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Patron role in Discord", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Mention in the release notes", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "Access to Udemy course upon release",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "Priority Support",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [
        {
          text: "Professional Python - 300 ADA/month (5,000 ADA Stake)",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Professional team-players and Project builders should sign up for this tier. In addition to ",
          type: "text",
        },
        {
          text: "all of the benefits for the previous tiers",
          type: "text",
          marks: [{ type: "italic" }],
        },
        { text: ", you get ", type: "text" },
        {
          text: "priority access to the following services:",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "One hour pair-programming ", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { text: "One hour consulting/mentorship ", type: "text" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Code review ", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Workshop for your team ", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Contracting", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { text: "Services for One-time Payments", type: "text" },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 1, textAlign: "left" },
      content: [
        {
          text: "Services for One-time Payments",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        { text: "Send ADA to ", type: "text" },
        { text: "$opshin", type: "text", marks: [{ type: "bold" }] },
        {
          text: " with a note for the following services:",
          type: "text",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { text: "Shout-out on Twitter - ", type: "text" },
                {
                  text: "75 ADA",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { text: "Mention in release notes - ", type: "text" },
                {
                  text: "150 ADA",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "Life-time access to Udemy course upon release -",
                  type: "text",
                },
                {
                  text: " 300 ADA",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { text: "One hour pair-programming - ", type: "text" },
                {
                  text: "445 ADA",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                {
                  text: "One hour consulting/mentorship - ",
                  type: "text",
                },
                {
                  text: "445 ADA",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [
                { text: "Workshop for your team - ", type: "text" },
                {
                  text: "1195 ADA",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 1, textAlign: "left" },
      content: [
        {
          text: "Other Services (DM to assess size!)",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Code review", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Contracting", type: "text" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ text: "Join your companies Chat", type: "text" }],
            },
          ],
        },
      ],
    },
  ],
};

const kreate$Benefits = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Kreate members can join our recurrent calls for progress updates, feature requests, and more.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "Kreate members also get early access to new platform features and benefits.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          text: "The more and longer you stake, the more land you get reserved in the Kreataverse as well.",
          type: "text",
        },
      ],
    },
  ],
};

const fallbackTiers = new Map<ProjectId, JSONContent>([
  // Mainnet
  [
    "0e149ccc2bc71165bf4eb28366b85c5791f62bb34b2d1c3cff895d63b86824fc",
    kikai$Benefits,
  ],
  [
    "f175855cf8b4eb481d050d9e457a209a69fd6f05229f02c5d3a507fefafcd0f9",
    shinkaNetwork$Benefits,
  ],
  [
    "8878844e2c8e2b0ded9613750b2d0ef912be40a50221dd21126bae622a1b1c12",
    fatCats$Benefits,
  ],
  [
    "755756faa35765c0a12a397c86113eb26ed13a08c83d31ede7b9609ef97efc03",
    demuPro$Benefits,
  ],
  [
    "96368c752b1eebb48c358061628144cdfa9aaeb87c8497542ca1e964fd540820",
    opshin$Benefits,
  ],
  [
    "1a5343834782954552a7e29d19dbddca9a88944e0ffadac8aa67399893e0a330",
    kreate$Benefits,
  ],
  // Preview
  [
    "98e87b80d3b5a480e2694f8faa36e1ea77f64b19e88c0b428e52317ea6c97571",
    kikai$Benefits,
  ],
  [
    "4598fcf1aec0953bc4751ad77b597dc0942da8c07dc0567b4eccc0c3926ef96d",
    shinkaNetwork$Benefits,
  ],
  [
    "dd0a17e9897bc5ba0952f30757e64fb36b37a1dc10ada33d14f30a362b5a112b",
    fatCats$Benefits,
  ],
  [
    "8473d48f3db161f316c8938682c641871b5e3118a6b61e239bb3481aa707ec89",
    demuPro$Benefits,
  ],
  [
    "aee4bddf3026cf7ea6e9e994dcf99ebb8948496522f1fa773160ca49b1249329",
    opshin$Benefits,
  ],
  [
    "1d164e9dc26b4d856e06f246561d419acd783897cad91d32b2e4b28e9b07f7ce",
    kreate$Benefits,
  ],
]);

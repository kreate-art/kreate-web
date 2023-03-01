import { faker } from "@faker-js/faker";

import { range } from "../array-utils";
import { convertDateAsDateIso } from "../business-types/utils/converters";

import {
  Address,
  DetailedProject,
  FrequentlyAskedQuestion,
  LovelaceAmount,
  Project,
  ProjectActivity,
  ProjectActivityAction,
  ProjectBasics,
  ProjectCommunity,
  ProjectCommunityUpdate,
  ProjectDescription,
  ProjectGeneralInfo,
  ProjectMilestone,
  ProjectRoadmapInfo,
  ProjectUpdateScope,
  PROJECT_UPDATE_SCOPE,
  ProtocolStatistics,
  SupporterInfo,
} from "@/modules/business-types";

export function generateSome<T>(generator: (index: number) => T): T[] {
  return range(faker.datatype.number(10)).map((index) => generator(index));
}

export function generateProjectBasics(): ProjectBasics {
  return {
    title: faker.commerce.productName(),
    slogan: faker.commerce.productAdjective() + " " + faker.commerce.product(),
    customUrl: faker.lorem.slug(),
    tags: faker.helpers.uniqueArray(
      () =>
        faker.helpers.arrayElement([
          faker.commerce.productAdjective(),
          faker.commerce.productMaterial(),
        ]),
      10
    ),
    summary: faker.commerce.productDescription(),
    coverImages: Array.from(Array(6), () => ({
      url: faker.image.business(800, 450, true),
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    })),

    logoImage: {
      url: faker.image.business(500, 400),
      x: 0.3,
      y: 0.1,
      width: 0.6,
      height: 0.75,
    },
  };
}

export function generateProjectDescription(): ProjectDescription {
  return {
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: "left" },
          content: [
            { type: "text", text: faker.commerce.productDescription() },
          ],
        },
        {
          type: "image",
          attrs: {
            src: faker.image.business(256, 256),
            alt: null,
            title: null,
            width: "340.1786834716157px",
            height: "340.1786834716157px",
          },
        },
        {
          type: "paragraph",
          attrs: { textAlign: "left" },
          content: [
            { type: "text", text: faker.commerce.productDescription() },
          ],
        },
      ],
    },
  };
}

export function generateMilestone(): ProjectMilestone {
  return {
    id: faker.datatype.uuid(),
    dateIso: convertDateAsDateIso(faker.date.past().valueOf()),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    funding: faker.datatype.number(),
    isCompleted: false,
  };
}

export function generateProjectRoadmap(): ProjectRoadmapInfo {
  return { milestones: generateSome(generateMilestone) };
}

export function generateSocialChannel(): string {
  const origin = faker.helpers.arrayElement([
    "https://facebook.com",
    "https://twitter.com",
    "https://instagram.com",
    "https://youtube.com",
    "https://telegram.com",
    "https://discord.gg",
    "https://reddit.com",
    "https://github.com",
    "https://medium.com",
    "https://linkedin.com",
    "https://twitch.tv",
    "https://pinterest.com",
    "https://snapchat.com",
    "https://t.me",
  ]);
  const username = faker.internet.userName();
  return origin + "/" + username;
}

export function generateFrequentlyAskedQuestion(): FrequentlyAskedQuestion {
  return {
    question: faker.lorem.sentence(),
    answer: faker.lorem.paragraphs(),
  };
}

export function generateProjectCommunity(): ProjectCommunity {
  return {
    socialChannels: generateSome(generateSocialChannel),
    frequentlyAskedQuestions: generateSome(generateFrequentlyAskedQuestion),
  };
}

export function generateAddress(): Address {
  switch (faker.datatype.boolean()) {
    case false:
      return (
        faker.helpers.arrayElement([
          "addr1v8",
          "addr1v9",
          "addr1vx",
          "addr1vy",
          "addr1wx",
        ]) +
        Array.from(Array(51), () =>
          faker.helpers.arrayElement(
            Array.from("qpzry9x8gf2tvdw0s3jn54khce6mua7l")
          )
        ).join("")
      );
    case true:
      return (
        faker.helpers.arrayElement([
          "addr1q8",
          "addr1q9",
          "addr1qx",
          "addr1qy",
          "addr1zx",
        ]) +
        Array.from(Array(96), () =>
          faker.helpers.arrayElement(
            Array.from("qpzry9x8gf2tvdw0s3jn54khce6mua7l")
          )
        ).join("")
      );
  }
}

export function generateUpdateScope(): ProjectUpdateScope[] {
  const scopes = faker.helpers.uniqueArray(PROJECT_UPDATE_SCOPE, 3);
  const result = [];
  for (const scope of scopes) {
    result.push(
      scope === "sponsorship"
        ? { type: scope, sponsorshipAmount: faker.datatype.bigInt() }
        : { type: scope }
    );
  }

  return result;
}

export function generateLovelaceAmount(): LovelaceAmount {
  return faker.datatype.bigInt(1e12);
}

export function generateProjectGeneralInfo(): ProjectGeneralInfo {
  return {
    id: faker.datatype.uuid(),
    basics: generateProjectBasics(),
    community: generateProjectCommunity(),
    history: {
      createdAt: faker.date.past().valueOf(),
      updatedAt: faker.date.recent().valueOf(),
    },
    stats: {
      numSupporters: faker.datatype.number(10000),
      numLovelacesStaked: faker.datatype.bigInt(),
      numLovelacesRaised: faker.datatype.bigInt(),
      averageMillisecondsBetweenProjectUpdates:
        faker.datatype.number(70) * faker.datatype.number(70) * 86400000,
    },
    categories: {
      sponsor: faker.datatype.number(100) < 30,
      featured: faker.datatype.number(100) < 30,
    },
    censorship: [],
    sponsorshipAmount: faker.datatype.number(5000) * 1000000,
    sponsorshipUntil: faker.date.future().valueOf(),
  };
}

export function generateProtocolStatistics(): ProtocolStatistics {
  return {
    numLovelaceRaised: faker.datatype.number(100000000000),
    numProjects: faker.datatype.number(100),
    numSupporters: faker.datatype.number(100000),
    numLovelaceStakedActive: faker.datatype.number(1000000000000),
    numProjectsActive: faker.datatype.number(50),
    numSupportersActive: faker.datatype.number(50000),
    averageMillisecondsBetweenProjectUpdates: faker.datatype.number(1000000000),
  };
}

export function generateProjectActivityAction(): ProjectActivityAction {
  return faker.helpers.arrayElement([
    {
      type: "back",
      createdBy: generateAddress(),
      lovelaceAmount: faker.datatype.bigInt(1000000000000),
      message: faker.commerce.productDescription(),
      createdTx: faker.datatype.string(),
    },
    {
      type: "unback",
      createdBy: generateAddress(),
      lovelaceAmount: faker.datatype.bigInt(1000000000000),
      message: faker.commerce.productDescription(),
      createdTx: faker.datatype.string(),
    },
    {
      type: "announcement",
      projectTitle: faker.commerce.productName(),
      title: faker.commerce.productAdjective(),
      message: faker.commerce.productDescription(),
    },
    {
      type: "project_update",
      projectTitle: faker.commerce.productName(),
      scope: generateUpdateScope(),
      message: faker.commerce.productDescription(),
    },
    {
      type: "protocol_milestone_reached",
      projectTitle: faker.commerce.productName(),
      milestonesSnapshot: faker.datatype.number(8),
      message: null,
    },
  ]);
}

export function generateCid(): string {
  return "Qm" + faker.random.alphaNumeric(44, { casing: "mixed" });
}

export function generateProjectActivity(): ProjectActivity {
  return {
    createdAt: faker.date.past().valueOf(),
    action: generateProjectActivityAction(),
    createdBy: generateAddress(),
  };
}

export function generateProjectActivityList(): ProjectActivity[] {
  return Array.from(
    Array(faker.helpers.arrayElement([0, 1, 3, 10, 30, 100, 300])),
    () => generateProjectActivity()
  );
}

export function generateJSONContent() {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: { textAlign: "left" },
        content: [{ type: "text", text: faker.commerce.productDescription() }],
      },
      {
        type: "image",
        attrs: {
          src: faker.image.business(256, 256),
          alt: null,
          title: null,
          width: "256px",
          height: "256px",
        },
      },
      {
        type: "paragraph",
        attrs: { textAlign: "left" },
        content: [{ type: "text", text: faker.commerce.productDescription() }],
      },
    ],
  };
}

export function generateProjectCommunityUpdate({
  sequenceNumber,
}: { sequenceNumber?: number } = {}): ProjectCommunityUpdate {
  return {
    announcementCid: generateCid(),
    id: faker.datatype.uuid(),
    title: faker.company.catchPhrase(),
    body: generateJSONContent(),
    summary: faker.commerce.productDescription(),
    createdAt: faker.date.past().valueOf(),
    createdBy: generateAddress(),
    sequenceNumber: sequenceNumber ?? faker.datatype.number(10),
  };
}

export function generateProjectCommunityUpdateList(): ProjectCommunityUpdate[] {
  return generateSome((index) =>
    generateProjectCommunityUpdate({ sequenceNumber: index + 1 })
  );
}

export function generateSupporterInfo(): SupporterInfo {
  return {
    address: generateAddress(),
    lovelaceAmount: generateLovelaceAmount(),
  };
}

export function generateDetailedProject(): DetailedProject {
  return {
    id: faker.datatype.uuid(),
    description: generateProjectDescription(),
    roadmapInfo: generateProjectRoadmap(),
    basics: generateProjectBasics(),
    community: generateProjectCommunity(),
    history: {
      createdAt: faker.date.past().valueOf(),
      updatedAt: faker.date.recent().valueOf(),
    },
    stats: {
      numSupporters: faker.datatype.number(10000),
      numLovelacesStaked: faker.datatype.bigInt(),
      numLovelacesRaised: faker.datatype.bigInt(),
      averageMillisecondsBetweenProjectUpdates:
        faker.datatype.number(70) * faker.datatype.number(70) * 86400000,
    },
    categories: {
      sponsor: faker.datatype.number(100) < 30,
      featured: faker.datatype.number(100) < 30,
    },
    announcements: generateProjectCommunityUpdateList(),
    activities: generateProjectActivityList(),
    topSupporters: generateSome(generateSupporterInfo),
  };
}

export function generateProject(): Project {
  return {
    description: generateProjectDescription(),
    basics: generateProjectBasics(),
    roadmapInfo: generateProjectRoadmap(),
    community: generateProjectCommunity(),
  };
}

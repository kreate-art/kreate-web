/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSONContent } from "@tiptap/core";

import {
  FrequentlyAskedQuestion,
  LovelaceAmount,
  Project,
  ProjectAnnouncement,
  ProjectBasics,
  ProjectCommunity,
  ProjectDescription,
  ProjectImage,
  ProjectMilestone,
  ProjectRoadmapInfo,
} from "..";

import { convertDateAsDateIso } from "./converters";

import { throw$ } from "@/modules/async-utils";

function parse$Nullable<T>(obj: any, parser: (obj: any) => T): T | null {
  if (typeof obj === "object" && obj === null) return null;
  return parser(obj);
}

function parse$Undefinedable<T>(
  obj: any,
  parser: (obj: any) => T
): T | undefined {
  if (typeof obj === "undefined") return undefined;
  return parser(obj);
}

// Primitive types

function parseString(obj: any): string {
  if (typeof obj !== "string") throw new TypeError("invalid string");
  return obj;
}

function parseNumber(obj: any): number {
  if (typeof obj !== "number") throw new TypeError("invalid number");
  return obj;
}

function parseBoolean(obj: any): boolean {
  if (typeof obj !== "boolean") throw new TypeError("invalid boolean");
  return obj;
}

function parseArrayT<T>(obj: any, parser: (obj: any) => T): T[] {
  if (!Array.isArray(obj)) throw new TypeError("invalid array");
  return obj.map(parser);
}

// Project types

function parseJSONContent(obj: any): JSONContent {
  if (typeof obj !== "object") throw new TypeError("invalid object");
  return obj;
}

function parseLovelaceAmount(obj: any): LovelaceAmount {
  if (typeof obj !== "number" && typeof obj !== "bigint")
    throw new TypeError("invalid LovelaceAmount");
  return obj;
}

function parseProjectImage(obj: any): ProjectImage {
  return typeof obj?.crop === "object"
    ? {
        url: parseString(obj?.url),
        crop: {
          x: parseNumber(obj?.crop?.x),
          y: parseNumber(obj?.crop?.y),
          w: parseNumber(obj?.crop?.w),
          h: parseNumber(obj?.crop?.h),
        },
      }
    : {
        url: parseString(obj?.url),
        crop: {
          x: parseNumber(obj?.x),
          y: parseNumber(obj?.y),
          w: parseNumber(obj?.width),
          h: parseNumber(obj?.height),
        },
      };
}

function parseProjectBasics$CoverImages(obj: any): ProjectImage[] {
  return parseArrayT<ProjectImage>(obj, parseProjectImage);
}

function parseProjectBasics$Tags(obj: any): string[] {
  return parseArrayT<string>(obj, parseString);
}

function parseProjectDescription(obj: any): ProjectDescription {
  return { body: parseJSONContent(obj?.body) };
}

function parseProjectMilestone(obj: any): ProjectMilestone {
  return {
    id: parseString(obj?.id),
    dateIso:
      typeof obj?.dateIso === "string"
        ? obj.dateIso
        : typeof obj?.date === "number"
        ? convertDateAsDateIso(obj.date)
        : throw$(new TypeError("invalid dateIso")),
    name: parseString(obj?.name),
    description: parseString(obj?.description),
    funding: parse$Undefinedable(obj?.funding, parseLovelaceAmount),
    isCompleted: parseBoolean(obj?.isCompleted),
  };
}

function parseProjectBasics(obj: any): ProjectBasics {
  return {
    title: parseString(obj?.title),
    slogan: parseString(obj?.slogan),
    customUrl: parse$Nullable<string>(obj?.customUrl, parseString),
    tags: parseProjectBasics$Tags(obj?.tags),
    summary: parseString(obj?.summary),
    coverImages: parseProjectBasics$CoverImages(obj?.coverImages),
    logoImage: parse$Nullable(obj?.logoImage, parseProjectImage),
  };
}

function parseProjectRoadmapInfo(obj: any): ProjectRoadmapInfo {
  return {
    milestones: parseArrayT<ProjectMilestone>(
      typeof obj?.milestones === "undefined" ? obj : obj?.milestones,
      parseProjectMilestone
    ),
  };
}

function parseFrequentlyAskedQuestion(obj: any): FrequentlyAskedQuestion {
  return {
    question: parseString(obj?.question),
    answer: parseString(obj?.answer),
  };
}

function parseProjectCommunity(obj: any): ProjectCommunity {
  return {
    socialChannels: parseArrayT<string>(obj?.socialChannels, parseString),
    frequentlyAskedQuestions: parseArrayT<FrequentlyAskedQuestion>(
      obj?.frequentlyAskedQuestions,
      parseFrequentlyAskedQuestion
    ),
  };
}

export function parseProjectAnnoucement(obj: any): ProjectAnnouncement {
  return {
    title: parseString(obj?.title),
    body: parseJSONContent(obj?.body),
    summary: parseString(obj?.summary),
    createdAt: parse$Undefinedable<number>(obj?.createdAt, parseNumber),
    createdBy: parse$Undefinedable<string>(obj?.createdBy, parseString),
    announcementCid: parse$Undefinedable<string>(
      obj?.announcementCid,
      parseString
    ),
    id: parse$Undefinedable<string>(obj?.id, parseString),
    sequenceNumber: parse$Undefinedable<number>(
      obj?.sequenceNumber,
      parseNumber
    ),
    censorship: parse$Undefinedable<string[]>(obj?.censorship, (obj: any) =>
      parseArrayT<string>(obj, parseString)
    ),
  };
}

export function parseProject(obj: any): Project {
  return {
    description: parseProjectDescription(obj?.description),
    basics: parseProjectBasics(obj?.basics),
    roadmapInfo:
      typeof obj?.roadmap === "object"
        ? parseProjectRoadmapInfo(obj?.roadmap)
        : typeof obj?.roadmapInfo === "object"
        ? parseProjectRoadmapInfo(obj?.roadmapInfo)
        : throw$(new TypeError("invalid roadmapInfo")),
    community: parseProjectCommunity(obj?.community),
  };
}

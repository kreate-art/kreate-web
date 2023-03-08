import { NEXT_PUBLIC_AI_URL } from "../../../config/client";
import { Sql } from "../connections";

import { getAllProjects } from "./getAllProjects";

import { httpPostTagsRecommendation } from "@/modules/ai/api/httpPostTagsRecommendation";
import { sortedBy } from "@/modules/array-utils";
import { ProjectGeneralInfo } from "@/modules/business-types";

export type Params = { active?: boolean; tags: string[] };

type Response = {
  projects: ProjectGeneralInfo[];
};

export async function getSimilarProjects(
  sql: Sql,
  { active, tags }: Params
): Promise<Response> {
  const {
    projects,
  }: { projects: (ProjectGeneralInfo & { relevantScore?: number })[] } =
    await getAllProjects(sql, { active });

  const listTags = projects.map((project) => project.basics.tags);
  const { recommend } = await httpPostTagsRecommendation({
    baseUrl: NEXT_PUBLIC_AI_URL,
    targetTag: tags,
    listTags,
  });

  for (let i = 0; i < projects.length; ++i) {
    projects[i].relevantScore = recommend[i] ?? 0;
  }

  return {
    projects: sortedBy(projects, (item) => -(item.relevantScore ?? 0)).filter(
      (project) => (project.relevantScore ?? 0) > 0.5
    ),
  };
}

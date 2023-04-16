import { Sql } from "../db";

import { ProjectGeneralInfo } from "@/modules/business-types";

export type Params = { active?: boolean; tags: string[] };

type Response = {
  projects: ProjectGeneralInfo[];
};

/** @deprecated */
export async function getSimilarProjects(
  _sql: Sql,
  _params: Params
): Promise<Response> {
  return {
    projects: [],
  };
}

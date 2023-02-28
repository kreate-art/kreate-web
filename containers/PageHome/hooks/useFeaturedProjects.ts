import useSWR from "swr";

import { httpGet } from "../utils/http";

import { ProjectGeneralInfo } from "@/modules/business-types";

export type UseFeaturedProjectResult = {
  error?: unknown;
  data?: {
    projects: ProjectGeneralInfo[];
  };
};

export function useFeaturedProjects(): UseFeaturedProjectResult {
  const url = "/api/featured-projects";
  const { data, error }: any = useSWR(url, httpGet);

  if (error) return { error };
  if (!data) return {};

  // Perform a light-weight type-check.
  if (data?.ok !== true || !Array.isArray(data?.data?.projects)) {
    return { error: new TypeError("invalid data") };
  }

  const projects: ProjectGeneralInfo[] = data?.data?.projects;

  return { data: { projects } };
}

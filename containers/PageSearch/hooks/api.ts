import useSWR from "swr";

import { Project, ProjectGeneralInfo } from "@/modules/business-types";
import { fromJson } from "@/modules/json-utils";
import { toProject } from "@/modules/storage/utils/serialization/project";

export type UseSearchProjectParams = {
  value: string;
  tag?: string;
};

export type UseSearchProjectResult = {
  error?: any;
  data?: {
    projects: ProjectGeneralInfo[];
  };
};

export async function httpGet(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  return fromJson(text);
}

function getSearchUrl({ value, tag }: UseSearchProjectParams) {
  const search = new URLSearchParams();
  search.append("value", value);
  console.log(tag);
  if (tag) {
    search.append("tag", tag);
  }
  return `/api/search?${search.toString()}`;
}

export function useSearchResults(
  params: UseSearchProjectParams
): UseSearchProjectResult {
  const url = getSearchUrl(params);
  const { data }: any = useSWR(url, httpGet);

  if (!data) return {};

  // Perform a light-weight type-check.
  //
  // In frontend, we do not want to perform an extensive type-check,
  // to keep the performance (data transfer, speed, etc).
  if (data?.error || !Array.isArray(data?.data)) {
    return { error: new TypeError("invalid data") };
  }

  const projects: ProjectGeneralInfo[] = data.data
    .map(toProject)
    .map((project: Project) => ({
      id: "", // TODO: Store this field
      basics: project.basics,
      history: {
        createdAt: 1, // TODO: Store this field
        updatedAt: 1, // TODO: Store this field
      },
      stats: {
        numSupporters: 1, // TODO: Store this field
        numLovelacesStaked: 1, // TODO: Store this field
        numLovelacesRaised: 1, // TODO: Store this field
      },
      categories: {
        featured: false, // TODO: Store this field
      },
    }));

  return { data: { projects } };
}

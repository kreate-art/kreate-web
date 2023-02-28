import useSWR from "swr";

import { ProjectGeneralInfo } from "@/modules/business-types";
import { fromJson } from "@/modules/json-utils";

export type UseFeaturedProjectsResult = {
  error?: unknown;
  data?: {
    projects: ProjectGeneralInfo[];
  };
};

export type UseTagsResult = {
  error?: unknown;
  data?: {
    tags: string[];
  };
};

export type UseSearchSuggestionParams = {
  value: string;
};

export type UseSearchProjectResult = {
  error?: unknown;
  data?: {
    projects: ProjectGeneralInfo[];
  };
};

export type UseSearchSuggestionResult = {
  error?: unknown;
  data?: {
    projects: {
      title: string;
      customUrl: string;
      slogan: string;
    }[];
  };
};

export async function httpGet(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  return fromJson(text);
}

function getSearchUrl({ value }: UseSearchSuggestionParams) {
  const search = new URLSearchParams({ value });
  return `/api/search/suggestion?${search.toString()}`;
}

export function useFeaturedProjects(): UseFeaturedProjectsResult {
  const url = "/api/featured-projects";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data }: any = useSWR(url, httpGet);

  if (!data) return {};

  // Perform a light-weight type-check.
  //
  // In frontend, we do not want to perform an extensive type-check,
  // to keep the performance (data transfer, speed, etc).
  if (data?.ok !== true || !Array.isArray(data?.data?.projects)) {
    return { error: new TypeError("invalid data") };
  }

  const projects: ProjectGeneralInfo[] = data?.data?.projects;

  return { data: { projects } };
}

export function useTags(): UseTagsResult {
  const url = `/api/tags/top`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data }: any = useSWR(url, httpGet);

  if (!data) return {};

  // Perform a light-weight type-check.
  //
  // In frontend, we do not want to perform an extensive type-check,
  // to keep the performance (data transfer, speed, etc).
  if (data?.error || !Array.isArray(data?.data)) {
    return { error: new TypeError("invalid data") };
  }

  const tags: string[] = data.data.map((item: { tag: string }) => item.tag);
  return { data: { tags } };
}

// TODO: Remove this
export function useSearchSuggestion(
  params: UseSearchSuggestionParams
): UseSearchSuggestionResult {
  const url = getSearchUrl(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data }: any = useSWR(url, httpGet);

  if (!data) return {};

  // Perform a light-weight type-check.
  //
  // In frontend, we do not want to perform an extensive type-check,
  // to keep the performance (data transfer, speed, etc).
  if (data?.error || !Array.isArray(data?.data)) {
    return { error: new TypeError("invalid data") };
  }

  return {
    data: {
      projects: data.data,
    },
  };
}

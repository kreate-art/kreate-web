import useSWR from "swr";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpPostNameGeneration } from "@/modules/ai/api/httpPostNameGeneration";
import { toJson } from "@/modules/json-utils";

export function useSuggestedTitles(
  keywords: string[] | null
): string[] | undefined {
  const { data, error } = useSWR(
    ["fda91f6a-bf8e-4aed-8be9-505f1752c573", toJson(keywords)],
    async () => {
      if (!keywords || !keywords.length) return undefined;
      const response = await httpPostNameGeneration({
        baseUrl: NEXT_PUBLIC_AI_URL,
        keywords,
      });
      return response.list_name;
    },
    {
      shouldRetryOnError: true,
      errorRetryCount: Infinity,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) {
    // purposely ignore the error because it is not important
    console.error(error);
    return undefined;
  }
  return data;
}

import useSWR from "swr";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpPostKeywordExtraction } from "@/modules/ai/api/httpPostKeywordExtraction";

export function useSuggestedTags(text: string | null): string[] | undefined {
  const { data, error } = useSWR(
    ["12557377-8978-4f0d-829c-677deb32b095", text],
    async () => {
      if (!text) return undefined;
      const response = await httpPostKeywordExtraction({
        baseUrl: NEXT_PUBLIC_AI_URL,
        text,
      });
      return response.tags;
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

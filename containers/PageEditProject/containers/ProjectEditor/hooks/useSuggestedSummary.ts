import useSWR from "swr";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpPostTextSummarization } from "@/modules/ai/api/httpPostTextSummarization";

export function useSuggestedSummary(text: string | null): string | undefined {
  const { data, error } = useSWR(
    ["a6f48d5f-f23a-4d3d-8fec-343528736224", text],
    async () => {
      if (!text) return undefined;
      const response = await httpPostTextSummarization({
        baseUrl: NEXT_PUBLIC_AI_URL,
        text,
      });
      return response?.summary;
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

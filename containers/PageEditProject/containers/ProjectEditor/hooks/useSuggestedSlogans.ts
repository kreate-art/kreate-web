import useSWR from "swr";

import { NEXT_PUBLIC_AI_URL } from "../../../../../config/client";

import { httpPostSloganGeneration } from "@/modules/ai/api/httpPostSloganGeneration";

type ProjectDescriptionBodyText = string;

export function useSuggestedSlogans(
  text: ProjectDescriptionBodyText | null
): string[] | undefined {
  const { data, error } = useSWR(
    ["06ad738a-cb18-497a-af3b-820a69779bc6", text],
    async () => {
      if (!text) return undefined;
      const response = await httpPostSloganGeneration({
        baseUrl: NEXT_PUBLIC_AI_URL,
        text,
      });
      return response.slogans;
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

import { Address } from "lucid-cardano";
import useSWR from "swr";

import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";
import { httpGetProjectMatch } from "@/modules/next-backend-client/api/httpGetProjectMatch";

/**
 * Returns the relevant score (in the range of [0..1]) of a
 * user with the specified address for a given project id
 */
export function useProjectMatch({
  projectId,
  relevantAddress,
}: {
  projectId?: string;
  relevantAddress?: Address;
}): number | undefined {
  const [value$Debounced, value$Dirty] = useDebounce({
    projectId,
    relevantAddress,
  });

  const { data, error } = useSWR(
    ["b1c608c6-34eb-47d1-9697-8f64132d670b", value$Debounced, value$Dirty],
    async () => {
      if (projectId === undefined || relevantAddress === undefined)
        return undefined;
      const response = await httpGetProjectMatch({
        projectId,
        relevantAddress,
      });
      return response.match;
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

import useSWR from "swr";

import { ProjectGeneralInfo } from "@/modules/business-types";
import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";
import { httpGetSimilarProjects } from "@/modules/next-backend-client/api/httpGetSimilarProjects";

export function useSimmilarProjects({
  tags,
  active,
}: {
  tags: string[];
  active?: boolean;
}): ProjectGeneralInfo[] | undefined {
  const [tags$Debounced, tags$Dirty] = useDebounce(tags);

  const { data, error } = useSWR(
    ["5e2415f6-2f9e-419b-a5a3-8547cbf766be", tags$Debounced, tags$Dirty],
    async () => {
      if (!tags || tags.length === 0) return undefined;
      const response = await httpGetSimilarProjects({ tags, active });
      return response.projects;
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

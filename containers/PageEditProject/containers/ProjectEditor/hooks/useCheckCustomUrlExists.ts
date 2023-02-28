import useSWR from "swr";

import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";

type Result = { exists: boolean };

export function useCheckCustomUrlExists({
  customUrl,
  ignoreIfProjectIdIs,
}: {
  customUrl: string;
  ignoreIfProjectIdIs?: string | null;
}): Result | undefined {
  const [customUrl$Debounced, customUrl$Dirty] = useDebounce(customUrl);
  const { data, error } = useSWR(
    [
      "c4abb109-bec0-4d84-a0dc-fca7e9bda96d",
      customUrl$Debounced,
      customUrl$Dirty,
    ],
    async () => {
      if (customUrl$Dirty || !customUrl$Debounced) return undefined;
      const response = await httpGetProject({
        customUrl: customUrl$Debounced,
        preset: "minimal",
      });
      // 1. If not existed, return false
      if (response.error) return { exists: false };
      // 2. If `ignoreIfProjectIdIs` is falsy, return true
      if (!ignoreIfProjectIdIs) return { exists: true };
      // 3. Compare `projectId` with `ignoreIfProjectIdIs`
      return { exists: response.project.id !== ignoreIfProjectIdIs };
    },
    {
      shouldRetryOnError: true,
      errorRetryCount: Infinity,
      refreshInterval: 60000, // every 60 seconds,
    }
  );
  if (error || !data) return undefined;
  return data;
}

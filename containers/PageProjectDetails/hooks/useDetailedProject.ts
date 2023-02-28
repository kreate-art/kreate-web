import useSWR from "swr";

import { DetailedProject } from "@/modules/business-types";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";

type UseDetailedProject$Params = {
  projectId?: string;
  projectCustomUrl?: string;
};

type UseDetailedProject$Result = {
  project?: DetailedProject;
  error?: string;
  mutate: () => void;
};

export default function useDetailedProject({
  projectId,
  projectCustomUrl,
}: UseDetailedProject$Params): UseDetailedProject$Result {
  const { data, error, mutate } = useSWR(
    [projectId, projectCustomUrl],
    async () => {
      if (projectId == null && projectCustomUrl == null) {
        return {};
      }
      const response = await httpGetProject({
        customUrl: projectCustomUrl,
        projectId,
        preset: "full",
      });
      if (response.error) return {};
      return { project: response.project };
    }
  );

  return { project: data?.project, error, mutate };
}

import useSWR from "swr";

import { DetailedProject } from "@/modules/business-types";
import { GetDetailedProject$Params } from "@/modules/next-backend/logic/getDetailedProject";
import {
  httpGetProject,
  httpGetProject$GetKey,
} from "@/modules/next-backend-client/api/httpGetProject";

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
  const params: GetDetailedProject$Params | undefined = {
    customUrl: projectCustomUrl,
    projectId,
    preset: "full",
  };

  const key = httpGetProject$GetKey(params);

  const { data, error, mutate } = useSWR(key, () =>
    params ? httpGetProject(params) : undefined
  );

  return {
    project: data && data.error == null ? data.project : undefined,
    error: error || data?.error,
    mutate,
  };
}

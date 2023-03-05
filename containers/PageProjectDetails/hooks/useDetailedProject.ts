import React from "react";
import useSWR from "swr";

import { DetailedProject } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import {
  GetDetailedProject$Params,
  GET_DETAILED_PROJECT__ERRORS,
} from "@/modules/next-backend/logic/getDetailedProject";
import {
  httpGetProject,
  httpGetProject$GetKey,
} from "@/modules/next-backend-client/api/httpGetProject";

type Result = {
  project?: DetailedProject;
  error?: DisplayableError;
  /** @deprecated see https://www.notion.so/shinka-network/48551043ee154ae0bac21ea0625d0cf3?pvs=4#ac0b31467b0347f4a303ec56d3b04acd */
  mutate: () => void;
};

export default function useDetailedProject(
  params: GetDetailedProject$Params | undefined
): Result {
  const key = httpGetProject$GetKey(params);

  const { data, error, mutate } = useSWR(key, () =>
    params ? httpGetProject(params) : undefined
  );

  const displayableError = React.useMemo(
    () =>
      error
        ? DisplayableError.from(error, "Failed to fetch project")
        : data?.error === GET_DETAILED_PROJECT__ERRORS.NOT_FOUND
        ? DisplayableError.from(data, "Project not found")
        : undefined,
    [error, data]
  );

  return {
    project: data && data.error == null ? data.project : undefined,
    error: displayableError,
    mutate,
  };
}

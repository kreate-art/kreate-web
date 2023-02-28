import useSWR from "swr";

import { DetailedProject } from "@/modules/business-types";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";

export type Params = {
  active?: boolean;
  customUrl?: string;
  projectId?: string;
  ownerAddress?: string;
  preset?: "minimal" | "basic" | "full";
};

type Result =
  | { error: null; data: { project: DetailedProject } }
  | { error: "fetch-failed"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export type UseDetailedProject$Result = Result;

export function useDetailedProject({
  active,
  customUrl,
  projectId,
  ownerAddress,
  preset,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    ["b6e81188-6ef9-4d77-b2bd-7a76680ba24a"],
    async () =>
      await httpGetProject({
        active,
        customUrl,
        projectId,
        ownerAddress,
        preset,
      })
  );

  if (error) {
    return { error: "fetch-failed", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  return {
    error: null,
    data: { project: data.project },
  };
}

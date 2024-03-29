import useSWR from "swr";

import { AuthHeader } from "@/modules/authorization";
import { DetailedProject } from "@/modules/business-types";
import {
  httpGetProject,
  httpGetProject$GetKey,
} from "@/modules/next-backend-client/api/httpGetProject";

export type Params = {
  active?: boolean;
  customUrl?: string;
  projectId?: string;
  ownerAddress?: string;
  preset?: "minimal" | "basic" | "full";
};

// Taken from "@/modules/next-backend/logic/getDetailedProject"
// We should NOT import a module from "backend" at "frontend"
// I think we should have something like "@/modules/common-types" to
// share types between BE & FE code.
type GetDetailedProject$Params = {
  active?: boolean;
  customUrl?: string;
  projectId?: string;
  ownerAddress?: string;
  relevantAddress?: string;
  preset: "minimal" | "basic" | "full";
  authHeader?: AuthHeader | undefined;
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
  preset = "basic",
}: Params): Result | undefined {
  const httpGetProject$Params: GetDetailedProject$Params | undefined = {
    active,
    customUrl,
    projectId,
    ownerAddress,
    preset,
  };
  const httpGetProject$Key = httpGetProject$GetKey(httpGetProject$Params);
  const { data, error } = useSWR(httpGetProject$Key, () =>
    httpGetProject$Params ? httpGetProject(httpGetProject$Params) : undefined
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

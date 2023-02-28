import useSWR from "swr";

import {
  DisplayableError,
  useDisplayableError,
} from "@/modules/displayable-error";
import {
  httpGetAllProjects,
  httpGetAllProjects$GetKey,
  HttpGetAllProjects$Params,
  HttpGetAllProjects$Response,
} from "@/modules/next-backend-client/api/httpGetAllProjects";

type Params = HttpGetAllProjects$Params;

export type UseAllProjects$Params = Params;

type Result = HttpGetAllProjects$Response;

export type UseAllProjects$Result = Result;

export function useAllProjects(params: Params): {
  data?: Result;
  error?: DisplayableError;
} {
  const { data, error } = useSWR(
    !!params.searchQuery === !!params.searchMethod
      ? httpGetAllProjects$GetKey(params)
      : undefined,
    async () => await httpGetAllProjects(params)
  );

  const displayableError = useDisplayableError(
    error,
    "Failed to fetch projects"
  );

  if (displayableError) {
    return { error: displayableError };
  }

  return { data };
}

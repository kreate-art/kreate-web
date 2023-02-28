import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import {
  GetAllProjects$Params,
  GetAllProjects$Response,
  toQuery$GetAllProjects,
} from "@/modules/next-backend/logic/getAllProjects";
import { toURLSearchParams } from "@/modules/query-utils";
import { prefixes, ResourceKey } from "@/modules/resource-keys";

type Params = GetAllProjects$Params;

export type HttpGetAllProjects$Params = Params;

type Response = GetAllProjects$Response;

export type HttpGetAllProjects$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    obj?.error === undefined &&
    Array.isArray(obj?.projects) &&
    ["undefined", "boolean"].includes(typeof obj?.hasMore)
  );
}

export async function httpGetAllProjects(params: Params): Promise<Response> {
  const query = toQuery$GetAllProjects(params);
  const search = toURLSearchParams(query);
  const response = await fetch(`/api/v1/all-projects?${search.toString()}`);
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");
  return data;
}

export function httpGetAllProjects$GetKey(
  params: Params | undefined
): ResourceKey | undefined {
  if (params == null) return undefined;
  return [...prefixes.protocol, "bdc9ed26-152a-41eb-8705-48220b6bcbd8", params];
}

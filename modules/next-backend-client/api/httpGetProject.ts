import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { GetAllProjects$Params } from "@/modules/next-backend/logic/getAllProjects";
import {
  GET_DETAILED_PROJECT__ERRORS,
  GetDetailedProject$Params,
  GetDetailedProject$Response,
} from "@/modules/next-backend/logic/getDetailedProject";
import { prefixes, ResourceKey } from "@/modules/resource-keys";

export type Cid = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is GetDetailedProject$Response {
  if (obj?.error === GET_DETAILED_PROJECT__ERRORS.NOT_FOUND) return true;
  return obj?.error === undefined && typeof obj?.project === "object";
}

export async function httpGetProject({
  active,
  customUrl,
  projectId,
  ownerAddress,
  preset,
}: GetDetailedProject$Params): Promise<GetDetailedProject$Response> {
  const search = new URLSearchParams();
  // TODO: define toQuery$GetDetailedProject
  if (active) search.append("active", active.toString());
  if (customUrl) search.append("customUrl", customUrl);
  if (projectId) search.append("projectId", projectId);
  if (ownerAddress) search.append("ownerAddress", ownerAddress);
  search.append("preset", preset);

  const response = await fetch(`/api/v1/project?${search.toString()}`);

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

export function httpGetProject$GetKey(
  params: GetAllProjects$Params | undefined
): ResourceKey | undefined {
  if (params == null) return undefined;
  return [...prefixes.protocol, "0daba241-017b-4b8b-99a4-cd88a30e5f7a", params];
}

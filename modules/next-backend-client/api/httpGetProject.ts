import { DetailedProject } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { GetAllProjects$Params } from "@/modules/next-backend/logic/getAllProjects";
import { prefixes, ResourceKey } from "@/modules/resource-keys";

export type Cid = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is GetDetailedProject$Response {
  if (obj?.error === GET_DETAILED_PROJECT__ERRORS.NOT_FOUND) return true;
  return obj?.error === undefined && typeof obj?.project === "object";
}

// Taken from "@/modules/next-backend/logic/getDetailedProject"
const ERRORS = {
  NOT_FOUND: 48,
} as const;

export const GET_DETAILED_PROJECT__ERRORS = ERRORS;

type Params = {
  active?: boolean;
  customUrl?: string;
  projectId?: string;
  ownerAddress?: string;
  relevantAddress?: string;
  preset: "minimal" | "basic" | "full";
  viewerAddress?: string | null;
};

export type GetDetailedProject$Params = Params;

type Response =
  | { error?: undefined; project: DetailedProject }
  | { error: typeof ERRORS.NOT_FOUND; _debug?: unknown };

export type GetDetailedProject$Response = Response;

export async function httpGetProject({
  active,
  customUrl,
  projectId,
  ownerAddress,
  preset,
  viewerAddress,
}: GetDetailedProject$Params): Promise<GetDetailedProject$Response> {
  const search = new URLSearchParams();
  // TODO: define toQuery$GetDetailedProject
  if (active) search.append("active", active.toString());
  if (customUrl) search.append("customUrl", customUrl);
  if (projectId) search.append("projectId", projectId);
  if (ownerAddress) search.append("ownerAddress", ownerAddress);
  if (viewerAddress) search.append("viewerAddress", viewerAddress);
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

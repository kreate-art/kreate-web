import { DetailedProject } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

export type Cid = string;

type Params = {
  active?: boolean;
  customUrl?: string;
  projectId?: string;
  ownerAddress?: string;
  preset?: "minimal" | "basic" | "full";
};

type Response =
  | { error: undefined; project: DetailedProject }
  | { error: 48; _debug?: unknown /* not found */ };

export type HttpGetProject$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  if (obj?.error === 48) return true;
  return obj?.error === undefined && typeof obj?.project === "object";
}

export async function httpGetProject({
  active,
  customUrl,
  projectId,
  ownerAddress,
  preset = "basic",
}: Params): Promise<Response> {
  const search = new URLSearchParams();
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

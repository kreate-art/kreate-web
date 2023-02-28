import { assert } from "@/modules/common-utils";

type Params = { projectId: string; relevantAddress: string };

type Response = { match: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj.match === "undefined" || typeof obj.match === "number";
}

export async function httpGetProjectMatch({
  projectId,
  relevantAddress,
}: Params): Promise<Response> {
  const search = new URLSearchParams({ projectId, relevantAddress });
  const response = await fetch(`/api/v1/project-match?${search.toString()}`);
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

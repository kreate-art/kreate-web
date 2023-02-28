import { ProjectGeneralInfo } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";

type Params = { tags: string[]; active?: boolean };

type Response = { projects: ProjectGeneralInfo[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return Array.isArray(obj?.projects);
}

export async function httpGetSimilarProjects({
  tags,
  active,
}: Params): Promise<Response> {
  const search = new URLSearchParams();
  if (tags) search.append("tags_commaSeparated", tags.join(","));
  if (active != null) search.append("active", active.toString());
  const response = await fetch(`/api/v1/similar-projects?${search.toString()}`);
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

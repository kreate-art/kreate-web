import { Address, ProjectActivity } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

// Better naming!
export const ACTOR_RELATIONSHIP = ["owned_by", "backed_or_owned_by"] as const;

export type ActivitiesActorRelationship = (typeof ACTOR_RELATIONSHIP)[number];

type Params = {
  actor: Address;
  relationship: ActivitiesActorRelationship;
  cursor: string | undefined;
  limit: number | undefined;
};

export type HttpGetAllActivities$Params = Params;

type Response = {
  activities: ProjectActivity[];
  nextCursor: string | null;
};

export type HttpGetAllActivities$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    Array.isArray(obj.activities) &&
    obj.activities.slice(0, 1).every(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) =>
        typeof item?.action === "object" &&
        typeof item?.createdAt === "number" &&
        typeof item?.createdBy === "string" &&
        ["string", "undefined"].includes(typeof item?.projectId)
    ) &&
    (obj?.nextCursor == null || typeof obj?.nextCursor === "string")
  );
}

export async function httpGetAllActivities({
  actor,
  relationship,
  cursor,
  limit,
}: Params): Promise<Response> {
  const search = new URLSearchParams();
  search.append("actor", actor);
  search.append("relationship", relationship);
  if (cursor != null) search.append("cursor", cursor);
  if (limit != null) search.append("limit", limit.toString());
  const response = await fetch(`/api/v1/all-activities?${search.toString()}`);
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");
  return data;
}

import { Address, UnixTime } from "lucid-cardano";

import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { AllPodcasts } from "@/modules/next-backend/logic/getAllPodcasts";

export type AllPodcasts$Response = {
  error: undefined;
  podcasts: AllPodcasts;
};

export async function httpGetAllPodcasts({
  backedBy,
  createdSince,
  createdBefore,
}: {
  backedBy?: Address;
  createdSince?: UnixTime;
  createdBefore?: UnixTime;
}): Promise<AllPodcasts$Response> {
  const search = new URLSearchParams();
  if (backedBy) search.append("backedBy", backedBy);
  if (createdSince) search.append("createdSince", createdSince.toString());
  if (createdBefore) search.append("createdBefore", createdBefore.toString());
  const url = `/api/v1/all-podcasts?${search.toString()}`;
  const response = await fetch(url);

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is AllPodcasts$Response {
  return (
    obj?.error === undefined &&
    obj?.podcasts &&
    typeof obj?.podcasts === "object"
  );
}

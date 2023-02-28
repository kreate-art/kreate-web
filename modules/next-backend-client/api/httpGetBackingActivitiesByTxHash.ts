import { assert } from "@/modules/common-utils";
import { BackingActivitiesByTxHash$Response } from "@/modules/next-backend/logic/getBackingActivitiesByTxHash";

type Params = {
  txHash: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is BackingActivitiesByTxHash$Response {
  return obj?.error === undefined && Array.isArray(obj?.activities);
}

export default async function httpGetBackingActivitiesByTxHash({
  txHash,
}: Params) {
  const search = new URLSearchParams({ txHash });
  const response = await fetch(`/api/v1/backing-actions?${search.toString()}`);
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

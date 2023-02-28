import { Address } from "lucid-cardano";

import { BackingHistory } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

type Params = {
  backerAddress: Address;
  projectId: string;
};

type Response = { error: undefined; history: BackingHistory };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    obj?.error === undefined &&
    typeof obj?.history === "object" &&
    typeof obj?.history?.projectId === "string" &&
    typeof obj?.history?.backerAddress === "string" &&
    ["number", "bigint"].includes(typeof obj?.history?.numLovelaceBacked) &&
    ["number", "bigint"].includes(typeof obj?.history?.numMicroTeikiUnclaimed)
  );
}

export async function httpGetBackingHistory({
  backerAddress,
  projectId,
}: Params): Promise<Response> {
  const search = new URLSearchParams({ backerAddress, projectId });
  const response = await fetch(`/api/v1/backing-history?${search.toString()}`);
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

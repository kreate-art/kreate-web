import { Address } from "lucid-cardano";

import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

type Response = {
  total: number;
  used: number;
};

type Params = {
  address: Address;
};

export async function httpGetFreeKolour({
  address,
}: Params): Promise<Response> {
  const search = new URLSearchParams({ address });
  const response = await fetch(`/api/kolours/kolour/free?${search.toString()}`);

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    obj?.error === undefined &&
    typeof obj?.total === "number" &&
    typeof obj?.used === "number"
  );
}

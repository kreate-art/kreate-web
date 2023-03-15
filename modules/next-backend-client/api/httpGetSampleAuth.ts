import * as Auth from "@/modules/authorization";
import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { load } from "@/modules/storage-v2";

type Params = { backerAddress: string; projectId: string };

type Response = { amount: LovelaceAmount };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj.amount === "bigint" || typeof obj.amount === "number";
}

export default async function httpGetSampleAuth({
  backerAddress,
  projectId,
}: Params): Promise<Response> {
  const params = new URLSearchParams();
  params.append("backerAddress", backerAddress);
  params.append("projectId", projectId);

  const token = (await load(Auth.getStorageKey())).data as Auth.AuthToken;

  const url = `/api/v1/sample-auth?${params.toString()}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: Auth.constructAuthHeader({
        token,
        address: backerAddress,
      }),
    }),
  });
  assert(response.ok, "response not ok");
  const res = await response.json();
  assert(isResponse(res), "invalid response");
  return res;
}

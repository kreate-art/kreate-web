import { Address } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";

type Params = {
  address: Address | undefined;
};

type Response = {
  kreations: GenesisKreationEntry[];
};

export type HttpGetAllNfts$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return Array.isArray(obj?.kreations);
}

export async function httpGetAllNfts({ address }: Params): Promise<Response> {
  const search = new URLSearchParams();
  if (address) search.append("address", address);
  const response = await fetch(`/api/kolours/genesis-kreation/list?${search}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = await fromJson(body);
  assert(isResponse(data), "invalid data");
  return data;
}

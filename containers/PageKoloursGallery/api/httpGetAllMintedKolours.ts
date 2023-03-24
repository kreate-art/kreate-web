import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { MintedKolourEntry } from "@/modules/kolours/types/Kolours";

type Response = {
  kolours: MintedKolourEntry[];
};

export type HttpGetAllMintedKolours$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return Array.isArray(obj?.kolours);
}

export async function httpGetAllMintedKolours(): Promise<Response> {
  const response = await fetch(`/api/kolours/kolour/list-minted`, {
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

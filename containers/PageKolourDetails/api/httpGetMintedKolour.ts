import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { Kolour, MintedKolourEntry } from "@/modules/kolours/types/Kolours";

type Params = {
  kolour: Kolour;
};

type Response = {
  mintedKolour: MintedKolourEntry;
};

export type HttpGetMintedKolour$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj?.mintedKolour === "object";
}

export async function httpGetMintedKolour({
  kolour,
}: Params): Promise<Response> {
  const search = new URLSearchParams({ kolour });
  const response = await fetch(
    `/api/kolours/kolour/minted/detail?${search.toString()}`
  );
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = await fromJson(body);
  assert(isResponse(data), "invalid data");
  return data;
}

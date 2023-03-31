import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";

type Response = {
  kreations: GenesisKreationEntry[];
};

export type HttpGetAllMintedKreations$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return Array.isArray(obj?.kreations);
}

export async function httpGetAllMintedKreations(): Promise<Response> {
  const response = await fetch("/api/kolours/genesis-kreation/list/minted");
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = await fromJson(body);
  assert(isResponse(data), "invalid data");
  return data;
}

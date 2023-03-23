import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { EnrichedUtxo } from "@/modules/next-backend/types";

export type TxParams$UserMintKolourNft = {
  kolourNftRefScriptUtxo: EnrichedUtxo;
};

export type TxParams$UserMintKolourNft$Response = {
  error: undefined;
  txParams: TxParams$UserMintKolourNft;
};

export async function httpGetTxParams$UserMintKolourNft(): Promise<TxParams$UserMintKolourNft$Response> {
  const url = "/api/kolours/kolour/params";
  const response = await fetch(url);

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$UserMintKolourNft$Response {
  return obj?.error === undefined && typeof obj?.txParams === "object";
}

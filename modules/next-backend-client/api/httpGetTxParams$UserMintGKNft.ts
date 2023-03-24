import { fromJson } from "@kreate/protocol/json";

import { assert } from "@/modules/common-utils";
import { EnrichedUtxo } from "@/modules/next-backend/types";

export type TxParams$UserMintGKNft = {
  gkNftRefScriptUtxo: EnrichedUtxo;
};

export type TxParams$UserMintGKNft$Response = {
  error: undefined;
  txParams: TxParams$UserMintGKNft;
};

export async function httpGetTxParams$UserMintGKNft(): Promise<TxParams$UserMintGKNft$Response> {
  const url = "/api/kolours/genesis-kreation/params";
  const response = await fetch(url);

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body, { forceBigInt: true });
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$UserMintGKNft$Response {
  return obj?.error === undefined && typeof obj?.txParams === "object";
}

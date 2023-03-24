/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hex } from "@kreate/protocol/types";

import { assert } from "@/modules/common-utils";
import { fromJson, toJson } from "@/modules/json-utils";
import { GenesisKreationQuotation } from "@/modules/kolours/types/Kolours";

type Params = {
  txHex: Hex;
  quotation: GenesisKreationQuotation;
  signature: string | undefined;
};

type Response = { txId: string; tx: Hex };

export async function httpPostMintGKNftTx({
  txHex,
  quotation,
  signature,
}: Params): Promise<Response> {
  assert(signature, "Must have signature");
  const params = new URLSearchParams();
  params.append("tx", txHex);
  params.append("quotation", toJson(quotation));
  params.append("signature", signature);

  const response = await fetch("/api/kolours/genesis-kreation/submit", {
    method: "POST",
    body: params,
  });

  assert(response.ok, "response not ok");
  const body = await response.text();
  const responseData = fromJson(body);
  assert(isResponse(responseData), "invalid response");

  return responseData;
}

function isResponse(obj: any): obj is Response {
  return obj?.error === undefined && obj?.txId && obj?.tx;
}

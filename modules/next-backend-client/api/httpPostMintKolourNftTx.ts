/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hex } from "@kreate/protocol/types";

import { assert } from "@/modules/common-utils";
import { fromJson, toJson } from "@/modules/json-utils";
import { KolourQuotation } from "@/modules/kolours/types/Kolours";

type Params = {
  quotation: KolourQuotation;
  signature: string;
  txHex: Hex;
};

type Response = { txId: string; tx: Hex };

export async function httpPostMintKolourNftTx({
  quotation,
  signature,
  txHex,
}: Params): Promise<Response> {
  const response = await fetch("/api/kolours/kolour/submit", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: toJson({
      quotation,
      signature,
      tx: txHex,
    }),
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

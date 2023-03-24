import { Address } from "lucid-cardano";

import { QuoteGKNft$Response } from "../../../pages/api/kolours/genesis-kreation/quote";

import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

type Params = {
  id: string;
  address: Address;
};

export async function httpGetQuoteGKNft({
  id,
  address,
}: Params): Promise<QuoteGKNft$Response> {
  const search = new URLSearchParams();

  search.append("id", id);
  search.append("address", address);
  const response = await fetch(
    `/api/kolours/genesis-kreation/quote?${search.toString()}`
  );

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  console.log("[DAA]: ", data);
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is QuoteGKNft$Response {
  return (
    obj?.error === undefined &&
    typeof obj?.quotation === "object" &&
    typeof obj?.status === "string" &&
    (obj?.signature ? typeof obj?.signature === "string" : true)
  );
}

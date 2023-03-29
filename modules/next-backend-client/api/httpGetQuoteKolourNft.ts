import { KolourQuotation, Kolour } from "@kreate/protocol/schema/teiki/kolours";
import { Address } from "lucid-cardano";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import { fromJson } from "@/modules/json-utils";
import { KolourQuotationSource } from "@/modules/kolours/types/Kolours";

type Response = {
  quotation: KolourQuotation;
  signature: crypt.Base64;
};

type Params = {
  source: KolourQuotationSource;
  kolours: Kolour[];
  address: Address;
};

export async function httpGetQuoteKolourNft({
  source,
  kolours,
  address,
}: Params): Promise<Response> {
  const search = new URLSearchParams();
  search.append("source", source.type);
  source.type === "genesis_kreation" &&
    search.append("kreation", source.kreation);
  search.append("kolour", kolours.join(","));
  search.append("address", address);

  const response = await fetch(
    `/api/kolours/kolour/quote?${search.toString()}`
  );

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    obj?.error === undefined &&
    typeof obj?.quotation === "object" &&
    typeof obj?.signature === "string"
  );
}

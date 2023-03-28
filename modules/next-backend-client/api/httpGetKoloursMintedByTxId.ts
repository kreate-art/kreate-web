import { assert } from "@/modules/common-utils";
import { KoloursMintedByTxId$Response } from "@/modules/next-backend/logic/getKoloursMintedByTxId";

type Params = {
  txId: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is KoloursMintedByTxId$Response {
  return obj?.error === undefined && Array.isArray(obj?.kolours);
}

export default async function httpGetKoloursMintedByTxId({ txId }: Params) {
  const search = new URLSearchParams({ txId });
  const response = await fetch(`/api/kolours/kolour/ping?${search.toString()}`);
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

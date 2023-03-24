import { assert } from "@/modules/common-utils";
import { KoloursMintedByTxHash$Response } from "@/modules/next-backend/logic/getKoloursMintedByTxHash";

type Params = {
  txHash: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is KoloursMintedByTxHash$Response {
  return obj?.error === undefined && typeof obj?.kolour === "string";
}

export default async function httpGetKoloursMintedByTxHash({ txHash }: Params) {
  const search = new URLSearchParams({ txHash });
  const response = await fetch(`/api/v1/kolours-minted?${search.toString()}`);
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

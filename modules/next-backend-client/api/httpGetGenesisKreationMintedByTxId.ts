import { assert } from "@/modules/common-utils";
import { GenesisKreationMintedByTxId$Response } from "@/modules/next-backend/logic/getGenesisKreationMintedByTxId";

type Params = {
  txId: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is GenesisKreationMintedByTxId$Response {
  return obj?.error === undefined && Array.isArray(obj?.kreations);
}

export default async function httpGetGenesisKreationMintedByTxId({
  txId,
}: Params) {
  const search = new URLSearchParams({ txId });
  const response = await fetch(
    `/api/kolours/genesis-kreation/ping?${search.toString()}`
  );
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

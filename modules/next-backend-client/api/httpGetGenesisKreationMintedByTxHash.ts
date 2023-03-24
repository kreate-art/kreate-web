import { assert } from "@/modules/common-utils";
import { GenesisKreationMintedByTxHash$Response } from "@/modules/next-backend/logic/getGenesisKreationMintedByTxHash";

type Params = {
  txHash: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is GenesisKreationMintedByTxHash$Response {
  return obj?.error === undefined && typeof obj?.kreation === "string";
}

export default async function httpGetGenesisKreationMintedByTxHash({
  txHash,
}: Params) {
  const search = new URLSearchParams({ txHash });
  const response = await fetch(
    `/api/v1/genesis-kreation-minted?${search.toString()}`
  );
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

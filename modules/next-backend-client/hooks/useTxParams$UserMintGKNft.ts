import useSWR from "swr";

import {
  httpGetTxParams$UserMintGKNft,
  TxParams$UserMintGKNft,
} from "../api/httpGetTxParams$UserMintGKNft";

type Result =
  | {
      error: null;
      data: { txParams: TxParams$UserMintGKNft };
    }
  | { error: "fetch-error"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export type UseTxParams$UserMintGKNft$Result = Result;

export function useTxParams$UserMintGKNft(): Result | undefined {
  const { data, error } = useSWR(
    ["e9e1e768-c949-11ed-afa1-0242ac120002"],
    async () => await httpGetTxParams$UserMintGKNft()
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  return { error: null, data: { txParams: data.txParams } };
}

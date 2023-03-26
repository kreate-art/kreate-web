import useSWR from "swr";

import {
  TxParams$UserMintKolourNft,
  httpGetTxParams$UserMintKolourNft,
} from "../api/httpGetTxParams$UserMintKolourNft";

type Result =
  | {
      error: null;
      data: { txParams: TxParams$UserMintKolourNft };
    }
  | { error: "fetch-error"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export type UseTxParams$UserMintKolourNft$Result = Result;

export function useTxParams$UserMintKolourNft(): Result | undefined {
  const { data, error } = useSWR(
    ["50469c35-eebc-4063-9525-7c01df363270"],
    async () => await httpGetTxParams$UserMintKolourNft()
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

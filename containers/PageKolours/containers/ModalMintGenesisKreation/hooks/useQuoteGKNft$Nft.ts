import useSWR from "swr";

import { QuoteGKNft$Response } from "../../../../../pages/api/kolours/genesis-kreation/quote";

import { Address } from "@/modules/business-types";
import { httpGetQuoteGKNft } from "@/modules/next-backend-client/api/httpGetQuoteGKNft";

type Result =
  | { error: null; data: QuoteGKNft$Response }
  | { error: "fetch-error"; _debug?: unknown };

export type UseQuoteGKNft$Result = Result;

export function useQuoteGKNft$Nft({
  id,
  address,
}: {
  id: string;
  address: Address;
}): Result | undefined {
  const { data, error } = useSWR(
    ["8c924d66-624e-449a-802d-0b8cdff72807", id, address],
    async () => await httpGetQuoteGKNft({ id, address })
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  return { error: null, data };
}

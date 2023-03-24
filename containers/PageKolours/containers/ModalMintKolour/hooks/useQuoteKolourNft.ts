import { Kolour } from "@kreate/protocol/schema/teiki/kolours";
import useSWR from "swr";

import { QuoteKolourNft$Response } from "../../../../../pages/api/kolours/kolour/quote";

import { Address } from "@/modules/business-types";
import { httpGetQuoteKolourNft } from "@/modules/next-backend-client/api/httpGetQuoteKolourNft";

type Result =
  | { error: null; data: QuoteKolourNft$Response }
  | { error: "fetch-error"; _debug?: unknown };

export type UseQuoteKolourNft$Result = Result;

export function useQuoteKolourNft$Nft({
  kolours,
  address,
}: {
  kolours: Kolour[];
  address: Address;
}): Result | undefined {
  const { data, error } = useSWR(
    ["8c924d66-624e-449a-802d-0b8cdff72807", kolours, address],
    async () => await httpGetQuoteKolourNft({ kolours, address })
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  return { error: null, data };
}

import { Kolour } from "@kreate/protocol/schema/teiki/kolours";
import useSWR from "swr";

import { QuoteKolourNft$Response } from "../../../../../pages/api/kolours/kolour/quote";

import { Address } from "@/modules/business-types";
import { KolourQuotationSource } from "@/modules/kolours/types/Kolours";
import { httpGetQuoteKolourNft } from "@/modules/next-backend-client/api/httpGetQuoteKolourNft";

type Result =
  | { error: null; data: QuoteKolourNft$Response }
  | { error: "fetch-error"; _debug?: unknown };

export type UseQuoteKolourNft$Params = {
  source: KolourQuotationSource;
  kolours: Kolour[];
  address: Address;
};

export type UseQuoteKolourNft$Result = Result;

export function useQuoteKolourNft$Nft(
  params: UseQuoteKolourNft$Params
): Result | undefined {
  const { data, error } = useSWR(
    ["8c924d66-624e-449a-802d-0b8cdff72807", params],
    async () => await httpGetQuoteKolourNft(params)
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  return { error: null, data };
}

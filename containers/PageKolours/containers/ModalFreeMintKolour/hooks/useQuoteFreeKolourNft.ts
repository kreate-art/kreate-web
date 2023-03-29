import useSWR from "swr";

import { QuoteKolourNft$Response } from "../../../../../pages/api/kolours/kolour/quote";

import { Address } from "@/modules/business-types";
import { Kolour, KolourQuotationSource } from "@/modules/kolours/types/Kolours";
import { httpGetQuoteKolourNft } from "@/modules/next-backend-client/api/httpGetQuoteKolourNft";

type Result =
  | { error: null; data: QuoteKolourNft$Response }
  | { error: "fetch-error"; _debug?: unknown };

export type UseQuoteFreeKolourNft$Result = Result;

export function useQuoteFreeKolourNft$Nft({
  kolours,
  address,
  source,
}: {
  kolours: Kolour[];
  address: Address;
  source: KolourQuotationSource;
}): Result | undefined {
  const { data, error } = useSWR(
    ["add772c3-9e98-46ee-94a8-0a116a883d35", kolours, address],
    async () => await httpGetQuoteKolourNft({ kolours, address, source })
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  return { error: null, data };
}

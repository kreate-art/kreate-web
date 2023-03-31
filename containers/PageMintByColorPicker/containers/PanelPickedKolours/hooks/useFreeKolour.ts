import useSWR from "swr";

import { KolourFree$Response } from "../../../../../pages/api/kolours/kolour/free";

import { Address } from "@/modules/business-types";
import { httpGetFreeKolour } from "@/modules/next-backend-client/api/httpGetFreeKolour";

type Result =
  | { error: null; data: KolourFree$Response }
  | { error: "fetch-error"; _debug?: unknown };

export type UseFreeKolour$Result = Result;

export function useFreeKolour({
  address,
}: {
  address: Address;
}): Result | undefined {
  const { data, error } = useSWR(
    ["2db21706-3d1f-4d69-ae44-df3cc1f500d7", address],
    async () => await httpGetFreeKolour({ address })
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  return { error: null, data };
}

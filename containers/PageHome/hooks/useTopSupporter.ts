import useSWR from "swr";

import { httpGet } from "../utils/http";

import { SupporterInfo } from "@/modules/business-types";

export type UseTopSupporterResult = {
  error?: unknown;
  data?: {
    supporters: SupporterInfo[];
  };
};

export function useTopSupporter(): UseTopSupporterResult {
  const url = "/api/v1/top-supporter";
  const { data, error }: any = useSWR(url, httpGet);

  if (error) return { error };
  if (!data) return {};

  // Perform a light-weight type-check.
  if (!Array.isArray(data?.supporters)) {
    return { error: new TypeError("invalid data") };
  }

  return { data: { supporters: data.supporters } };
}

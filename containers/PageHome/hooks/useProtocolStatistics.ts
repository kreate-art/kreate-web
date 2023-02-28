import useSWR from "swr";

import { httpGet } from "../utils/http";

import { ProtocolStatistics } from "@/modules/business-types";

export type UseProtocolStatisticsResult = {
  error?: unknown;
  data?: {
    protocolStatistics: ProtocolStatistics;
  };
};

export function useProtocolStatistics(): UseProtocolStatisticsResult {
  const url = "/api/v1/protocol-statistics";
  const { data, error }: any = useSWR(url, httpGet);

  if (error) return { error };
  if (!data) return {};

  // Perform a light-weight type-check.
  if (typeof data?.protocolStatistics !== "object") {
    return { error: new TypeError("invalid data") };
  }

  const protocolStatistics: ProtocolStatistics = data?.protocolStatistics;
  return { data: { protocolStatistics } };
}

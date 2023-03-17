import { Hex } from "@kreate/protocol/types";
import { Address } from "lucid-cardano";
import useSWR from "swr";

import { httpGet } from "../../PageHome/utils/http";

import { LovelaceAmount } from "@/modules/business-types";

export type UseTotalStakedByBackerResult = {
  error?: unknown;
  data?: {
    amount: LovelaceAmount;
  };
  mutate?: () => void;
  // NOTE: @sk-tenba: `mutate` is used for triggering data revalidation
};

export type UseTotalStakedByBacker = {
  backerAddress: Address;
  projectId: Hex;
};
export function useTotalStakedByBacker({
  backerAddress,
  projectId,
}: UseTotalStakedByBacker): UseTotalStakedByBackerResult {
  const params = new URLSearchParams();
  params.append("backerAddress", backerAddress);
  params.append("projectId", projectId);

  const url = `/api/v1/total-staked-by-backer?${params.toString()}`;
  const { data, error, mutate }: any = useSWR(url, httpGet);

  if (error) return { error };
  if (!data) return {};

  return { data, mutate };
}

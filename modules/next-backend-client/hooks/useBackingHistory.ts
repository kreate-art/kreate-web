import useSWR from "swr";

import { httpGetBackingHistory } from "../api/httpGetBackingHistory";

import { Address, BackingHistory } from "@/modules/business-types";

type Params = {
  projectId: string;
  backerAddress: Address;
};

type Result = { history: BackingHistory };

export function useBackingHistory({
  projectId,
  backerAddress,
}: Params): [Result | undefined, unknown] {
  const { data, error } = useSWR(
    ["26b84c1c-2d43-4974-bd5a-8a3fea0a1e3d", projectId, backerAddress],
    async () => await httpGetBackingHistory({ backerAddress, projectId })
  );
  return [data, error];
}

import useSWR from "swr";

import { httpGetUser, HttpGetUser$Response } from "../api/httpGetUser";

import { Address } from "@/modules/business-types";

type Params = {
  address: Address | undefined;
};

type Result = HttpGetUser$Response;

export function useUser(
  { address }: Params,
  deps: React.DependencyList = []
): [Result | undefined, unknown] {
  const { data, error } = useSWR(
    ["c4ce410f-8151-4340-96a6-cdc797d25ead", address, ...deps],
    async () => {
      if (!address) return undefined;
      return await httpGetUser({ address });
    }
  );
  return [data, error];
}

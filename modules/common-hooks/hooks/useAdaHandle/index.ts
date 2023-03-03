import useSWR from "swr";

import { NEXT_PUBLIC_HANDLE_POLICY_ID } from "../../../../config/client";

import httpGetAddressDetails from "./utils/httpGetAddressDetails";

export default function useAdaHandle(address: string) {
  const policyID = NEXT_PUBLIC_HANDLE_POLICY_ID;
  const { data, error } = useSWR(
    ["69571ca3-8c12-4243-acf3-f90c19114abe", address],
    async () => {
      if (!address) return undefined;
      const addressDetails = await httpGetAddressDetails({ address });

      const handles = addressDetails.amount
        .filter(({ unit }) => unit.includes(policyID))
        .map(({ unit }) => {
          const hexName = unit.replace(policyID, "");
          const utf8Name = Buffer.from(hexName, "hex").toString("utf8");
          return utf8Name;
        });
      if (handles.length > 0) {
        return handles[0];
      }
      return undefined;
    }
  );
  return { data, error };
}

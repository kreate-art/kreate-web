import useSWR from "swr";

import {
  NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  NEXT_PUBLIC_BLOCKFROST_URL,
  NEXT_PUBLIC_HANDLE_POLICY_ID,
} from "../../../config/client";

type Response = {
  address: string;
  amount: {
    unit: string;
    quantity: string;
  }[];
  stake_address: string;
  type: string;
  script: boolean;
};

export default function useAdaHandle(address?: string) {
  const policyID = NEXT_PUBLIC_HANDLE_POLICY_ID;
  const { data, error } = useSWR(address, async (address) => {
    if (address === "" || address == null) {
      return undefined;
    }
    const response = await fetch(
      `${NEXT_PUBLIC_BLOCKFROST_URL}/addresses/${address}`,
      {
        headers: {
          project_id: NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
          "Content-Type": "application/json",
        },
      }
    );
    const data: Response = await response.json();

    const handles = data.amount
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
  });
  return { data, error };
}

import {
  NEXT_PUBLIC_BLOCKFROST_URL,
  NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
} from "../../../../../config/client";

import { assert } from "@/modules/common-utils";

type Params = {
  address: string;
};

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

function isResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is Response {
  return (
    typeof response?.address === "string" &&
    Array.isArray(response?.amount) &&
    typeof response?.stake_address === "string" &&
    typeof response?.type === "string" &&
    typeof response?.script === "boolean"
  );
}

export default async function httpGetAddressDetails({ address }: Params) {
  const response = await fetch(
    `${NEXT_PUBLIC_BLOCKFROST_URL}/addresses/${address}`,
    {
      headers: {
        project_id: NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
        "Content-Type": "application/json",
      },
    }
  );
  assert(response.ok, "response not ok");
  const data: Response = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

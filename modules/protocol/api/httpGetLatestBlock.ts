// https://docs.blockfrost.io/#tag/Cardano-Blocks/paths/~1blocks~1latest/get
import {
  NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  NEXT_PUBLIC_BLOCKFROST_URL,
} from "../../../config/client";

import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

type Response = {
  time: number;
  slot: number;
  // feel free to add more fields here
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj?.time === "number" && typeof obj?.slot === "number";
}

export async function httpGetLatestBlock(): Promise<Response> {
  const response = await fetch(`${NEXT_PUBLIC_BLOCKFROST_URL}/blocks/latest`, {
    headers: {
      "Content-Type": "application/json",
      project_id: NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
    },
  });
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");
  return data;
}

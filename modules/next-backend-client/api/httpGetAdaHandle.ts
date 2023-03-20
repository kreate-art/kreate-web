import { assert } from "@/modules/common-utils";

type Params = {
  addresses: string[];
};

type Response = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj === "object";
}

export async function httpGetAdaHandle({
  addresses,
}: Params): Promise<Response> {
  const addressesList = addresses.join(",");
  const search = new URLSearchParams();
  search.append("address", addressesList);
  const response = await fetch(
    `/api/v1/ada-handle-by-addresses?${search.toString()}`
  );
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}

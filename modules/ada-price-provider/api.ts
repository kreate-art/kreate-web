import { UnixTimestamp } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";

export type HttpGetAdaPrice$Response = {
  cardano: {
    last_updated_at: UnixTimestamp; // UNIX timestamp in seconds
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
};

export function isHttpGetAdaPriceResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is HttpGetAdaPrice$Response {
  const cardano = response?.cardano;
  return (
    typeof cardano?.last_updated_at === "number" &&
    typeof cardano?.usd === "number" &&
    typeof cardano?.usd_24h_change === "number" &&
    typeof cardano?.usd_24h_vol === "number" &&
    typeof cardano?.usd_market_cap === "number"
  );
}

export async function httpGetAdaPrice(): Promise<HttpGetAdaPrice$Response> {
  const response = await fetch(`/api/v1/ada-price`, {
    headers: { Accept: "application/json" },
  });
  assert(response.ok, "response not ok");
  const obj = await response.json();
  assert(isHttpGetAdaPriceResponse(obj), "invalid response");
  return obj;
}

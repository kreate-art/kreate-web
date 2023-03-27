import useSWR from "swr";

import { AdaPriceInfo } from "../types";
import { httpGetAdaPrice } from "../utils/api";

export function useAdaPriceInfo(): AdaPriceInfo | undefined {
  const { data, error } = useSWR(
    // an arbitrary UUID
    "633a6f13-9190-4ca4-be77-17807678da69",
    httpGetAdaPrice,
    { revalidateOnFocus: false }
  );
  if (error || !data) return undefined;

  return {
    lastUpdatedAt: data.cardano.last_updated_at * 1000,
    usd: data.cardano.usd,
    usd24hChange: data.cardano.usd_24h_change,
    usd24hVol: data.cardano.usd_24h_vol,
    usdMarketCap: data.cardano.usd_market_cap,
  };
}

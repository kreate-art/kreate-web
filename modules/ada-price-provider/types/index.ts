import { UnixTimestamp } from "@/modules/business-types";

export type AdaPriceInfo = {
  lastUpdatedAt: UnixTimestamp;
  usd: number;
  usd24hChange: number;
  usd24hVol: number;
  usdMarketCap: number;
};

export type HttpGetAdaPrice$Response = {
  cardano: {
    last_updated_at: UnixTimestamp; // UNIX timestamp in seconds
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
};

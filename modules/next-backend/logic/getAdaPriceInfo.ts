import { randomUUID } from "crypto";

import { Redis } from "ioredis";

import { HttpGetAdaPrice$Response } from "@/modules/ada-price-provider/types";
import { assert } from "@/modules/common-utils";
import locking from "@/modules/next-backend/locking";

export const REDIS_ADA_PRICE_KEY = "kreate:ada-price";
export const REDIS_ADA_PRICE_LOCK = "kreate:ada-price-lock";

// A copy from "@modules/ada-price-provider/utils/api.ts"
function isHttpGetAdaPriceResponse(
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

export async function getAdaPriceInfo(redis: Redis) {
  let cachedAdaPriceResponse = await redis.get(REDIS_ADA_PRICE_KEY);

  if (cachedAdaPriceResponse != null) {
    try {
      return adaPriceFromCache(cachedAdaPriceResponse);
    } catch (error) {
      console.warn(error);
      return fetchAdaPrice(redis);
    }
  }
  const lock = await locking.acquire(
    REDIS_ADA_PRICE_LOCK,
    randomUUID(),
    { ttl: 2 },
    100
  );
  try {
    cachedAdaPriceResponse = await redis.get(REDIS_ADA_PRICE_KEY);
    if (cachedAdaPriceResponse != null)
      return adaPriceFromCache(cachedAdaPriceResponse);
    return fetchAdaPrice(redis);
  } finally {
    await lock.release();
  }
}

function adaPriceFromCache(obj: string): HttpGetAdaPrice$Response {
  const priceInfo = JSON.parse(obj) as HttpGetAdaPrice$Response;
  if (!isHttpGetAdaPriceResponse(priceInfo)) {
    throw new Error("Malformed ADA price info in cache");
  }
  return priceInfo;
}

async function fetchAdaPrice(redis: Redis) {
  const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
  const search = new URLSearchParams({
    ids: "cardano",
    vs_currencies: "usd",
    include_market_cap: "true",
    include_24hr_vol: "true",
    include_24hr_change: "true",
    include_last_updated_at: "true",
    precision: "full",
  });
  const response = await fetch(`${baseUrl}?${search}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  assert(response.ok, "response not ok");
  const obj = await response.json();
  assert(isHttpGetAdaPriceResponse(obj), "invalid response");
  redis.set(REDIS_ADA_PRICE_KEY, JSON.stringify(obj), "EX", 60); // 1 minute
  return obj;
}

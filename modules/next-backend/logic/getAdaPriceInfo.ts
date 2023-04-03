import { randomUUID } from "crypto";

import { Redis } from "ioredis";

import {
  HttpGetAdaPrice$Response,
  isHttpGetAdaPriceResponse,
} from "@/modules/ada-price-provider/api";
import { assert } from "@/modules/common-utils";
import { fromJson, toJson } from "@/modules/json-utils";
import locking from "@/modules/next-backend/locking";

const REDIS_ADA_PRICE_KEY = "kreate:ada-price";
const REDIS_ADA_PRICE_LOCK = "kreate:ada-price.lock";

export async function lookupAdaPriceInfo(redis: Redis): Promise<{
  status: "hit" | "miss" | "remake";
  response: HttpGetAdaPrice$Response;
}> {
  let cacheStatus: "miss" | "remake" = "miss";
  let cachedAdaPriceResponse = await redis.get(REDIS_ADA_PRICE_KEY);
  if (cachedAdaPriceResponse != null)
    try {
      return {
        status: "hit",
        response: adaPriceFromCache(cachedAdaPriceResponse),
      };
    } catch (error) {
      cacheStatus = "remake";
      console.warn("Malformed ADA price in cache", error);
    }
  const lock = await locking.acquire(
    REDIS_ADA_PRICE_LOCK,
    randomUUID(),
    { ttl: 2 },
    50
  );
  try {
    cachedAdaPriceResponse = await redis.get(REDIS_ADA_PRICE_KEY);
    if (cachedAdaPriceResponse != null)
      // Propagate error if there's one
      return {
        status: cacheStatus,
        response: adaPriceFromCache(cachedAdaPriceResponse),
      };
    const res = await fetchAdaPrice();
    await storeAdaPriceToCache(redis, res);
    return { status: cacheStatus, response: res };
  } finally {
    await lock.release();
  }
}

function adaPriceFromCache(obj: string): HttpGetAdaPrice$Response {
  const priceInfo = fromJson<HttpGetAdaPrice$Response>(obj);
  assert(
    isHttpGetAdaPriceResponse(priceInfo),
    "Malformed ADA price info in cache"
  );
  return priceInfo;
}

async function fetchAdaPrice() {
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
  return obj;
}

async function storeAdaPriceToCache(
  redis: Redis,
  response: HttpGetAdaPrice$Response
) {
  return redis.set(REDIS_ADA_PRICE_KEY, toJson(response), "EX", 60); // 1 minute
}

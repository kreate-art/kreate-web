import { randomUUID } from "crypto";

import { Redis } from "ioredis";
import { Address, Blockfrost, Lucid } from "lucid-cardano";

import { toJson } from "../json-utils";

import { Kolours } from "./types";
import { Referral } from "./types/Kolours";

import { MaybePromise } from "@/modules/async-utils";
import { Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";
import { Lovelace } from "@/modules/next-backend/types";

export const DISCOUNT_MULTIPLIER = 10000;

export const FEE_MULTIPLIER = BigInt(2);

export async function lookupReferral(
  lucid$: () => MaybePromise<Lucid>,
  redis: Redis,
  sql: Sql,
  address: Address
): Promise<Referral | undefined> {
  const referralKey = KOLOUR_ADDRESS_REFERRAL_PREFIX + address;
  const cachedReferral = await redis.get(referralKey);
  if (cachedReferral != null) return referralFromText(cachedReferral);
  const poolId = await lookupDelegation(lucid$, redis, address);
  const referral = poolId
    ? await lookupPoolReferral(redis, sql, poolId)
    : undefined;
  void redis.set(referralKey, referralToText(referral), "EX", 60); // 1 minute
  return referral;
}

export async function lookupPoolReferral(
  redis: Redis,
  sql: Sql,
  poolId: string
): Promise<Referral | undefined> {
  const referralKey = KOLOUR_POOL_REFERRAL_PREFIX + poolId;
  const cachedReferral = await redis.get(referralKey);
  if (cachedReferral != null) return referralFromText(cachedReferral);
  const referral = await queryPoolReferral(sql, poolId);
  void redis.set(referralKey, referralToText(referral), "EX", 60); // 1 minute
  return referral;
}

export async function lookupDelegation(
  lucid$: () => MaybePromise<Lucid>,
  redis: Redis,
  address: Address
): Promise<string | undefined> {
  const delegationKey = KOLOUR_STAKE_DELEGATION_PREFIX + address;
  let cached = await redis.get(delegationKey);
  if (cached != null) return cached || undefined;

  const lockKey = KOLOUR_STAKE_DELEGATION_LOCK_PREFIX + address;
  const lock = await locking.acquire(lockKey, randomUUID(), { ttl: 2 }, 100);
  try {
    // Fetch again, just in case the image was already processed, better use WATCH
    cached = await redis.get(delegationKey);
    if (cached != null) return cached || undefined;
    const delegation = await queryDelegation(await lucid$(), address);
    await redis.set(delegationKey, delegation ?? "", "EX", 3600); // 1 hour
    return delegation;
  } finally {
    lock.release();
  }
}

async function queryPoolReferral(
  sql: Sql,
  poolId: string
): Promise<Referral | undefined> {
  const [row]: [{ id: string; discount: string }?] = await sql`
    SELECT id, discount FROM kolours.referral
    WHERE pool_id = ${poolId}
  `;
  return row
    ? {
        id: row.id,
        discount: BigInt(
          Math.trunc(Number(row.discount) * DISCOUNT_MULTIPLIER)
        ),
      }
    : undefined;
}

async function queryDelegation(
  lucid: Lucid,
  address: Address
): Promise<string | undefined> {
  const { stakeCredential } = lucid.utils.getAddressDetails(address);
  if (!stakeCredential) return undefined;
  const rewardAddress = lucid.utils.credentialToRewardAddress(stakeCredential);
  const blockfrost = lucid.provider as Blockfrost;
  const params = new URLSearchParams({ count: "1", order: "desc" });
  const response = await fetch(
    `${blockfrost.url}/accounts/${rewardAddress}/history?${params}`,
    { headers: { project_id: blockfrost.projectId } }
  );
  const result = await response.json();
  if (!result) throw new Error("empty blockfrost response");
  if (result.error) throw new Error(toJson(result));
  return Array.isArray(result) && result.length ? result[0].pool_id : undefined;
}

export function computeFees(
  baseFee: Lovelace,
  discount?: bigint
): { listedFee: Lovelace; fee: Lovelace } {
  const listedFee = baseFee;
  const half = baseFee / BigInt(2);
  const fee = discount
    ? half - (half * discount) / BigInt(DISCOUNT_MULTIPLIER)
    : half;
  return { fee, listedFee };
}

export function calculateKolourFee(kolour: Kolours.Kolour): Lovelace {
  return BigInt(
    Math.max(
      2_000_000,
      Buffer.from(kolour, "hex").reduce((sum, v) => sum * 1000 + v, 0)
    )
  );
}

function referralToText(referral: Referral | undefined) {
  return referral ? `${referral.id}|${referral.discount}` : "";
}

function referralFromText(text: string): Referral | undefined {
  if (text) {
    const [id, discount] = text.split("|");
    return { id, discount: BigInt(discount) };
  } else {
    return undefined;
  }
}

export const KOLOUR_POOL_REFERRAL_PREFIX = "ko:ref:p:";
export const KOLOUR_ADDRESS_REFERRAL_PREFIX = "ko:ref:a:";
export const KOLOUR_STAKE_DELEGATION_PREFIX = "ko:stake:";
export const KOLOUR_STAKE_DELEGATION_LOCK_PREFIX = "ko:stake.lock:";

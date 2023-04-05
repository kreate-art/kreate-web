import { randomUUID } from "node:crypto";

import {
  Address,
  C,
  Credential,
  getAddressDetails,
  Network,
  networkToId,
} from "lucid-cardano";

import { BLOCKFROST_PROJECT_ID, BLOCKFROST_URL, NETWORK } from "../env/client";
import { toJson } from "../json-utils";

import { QUOTATION_TTL } from "./common";
import { discountFromDb } from "./fees";
import {
  EPOCH_END_KEY,
  EPOCH_LOCK_KEY,
  KOLOUR_ADDRESS_REFERRAL_PREFIX,
  KOLOUR_STAKE_DELEGATION_LOCK_PREFIX,
  KOLOUR_STAKE_DELEGATION_PREFIX,
} from "./keys";
import { Referral } from "./types/Kolours";

import { UnixTimestamp } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import type { Redis } from "@/modules/next-backend/connections";
import type { Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";

export async function lookupReferral(
  redis: Redis,
  sql: Sql,
  address: Address,
  lockId?: string
): Promise<Referral | null> {
  const referralKey = KOLOUR_ADDRESS_REFERRAL_PREFIX + address;
  try {
    const cachedReferral = await redis.get(referralKey);
    if (cachedReferral != null) return referralFromText(cachedReferral);
    lockId ??= randomUUID();
    const poolId = await lookupDelegation(redis, address, lockId);
    const referral = poolId ? await queryPoolReferral(sql, poolId) : null;
    void redis.set(referralKey, referralToText(referral), "EX", QUOTATION_TTL);
    return referral;
  } catch (error) {
    // We differentiate between "temporary" and "permanent" error.
    // Since we already handle invalid addresses (permanent) in `queryDelegation`
    // This error is temporary, hence it's fine to just retry later
    console.warn("lookupReferral:", error);
    return null;
  }
}

export async function lookupDelegation(
  redis: Redis,
  address: Address,
  lockId = randomUUID()
): Promise<string | undefined> {
  const delegationKey = KOLOUR_STAKE_DELEGATION_PREFIX + address;
  let cached = await redis.get(delegationKey);
  if (cached != null) return cached || undefined;
  const lockKey = KOLOUR_STAKE_DELEGATION_LOCK_PREFIX + address;
  const lock = await locking.acquire(lockKey, lockId, { ttl: 2 }, 100);
  try {
    // Fetch again, just in case the result was already processed, better use WATCH
    cached = await redis.get(delegationKey);
    if (cached != null) return cached || undefined;
    const [delegation, epochEnd] = await Promise.all([
      queryDelegation(address),
      lookupEpochEnd(redis, lockId),
    ]);
    await redis.set(delegationKey, delegation ?? "", "PX", epochExp(epochEnd));
    return delegation;
  } finally {
    await lock.release();
  }
}

async function lookupEpochEnd(
  redis: Redis,
  lockId = randomUUID()
): Promise<UnixTimestamp> {
  let cached = await redis.get(EPOCH_END_KEY);
  if (cached != null) return Number(cached);
  const lock = await locking.acquire(EPOCH_LOCK_KEY, lockId, { ttl: 2 }, 100);
  try {
    // Fetch again, just in case the result was already processed, better use WATCH
    cached = await redis.get(EPOCH_END_KEY);
    if (cached != null) return Number(cached);
    const epochEnd = await queryEpochEnd();
    await redis.set(EPOCH_END_KEY, epochEnd, "PX", epochExp(epochEnd));
    return epochEnd;
  } finally {
    await lock.release();
  }
}

async function queryPoolReferral(
  sql: Sql,
  poolId: string
): Promise<Referral | null> {
  const [row]: [{ id: string; discount: string }?] = await sql`
    SELECT id, discount FROM kolours.referral
    WHERE pool_id = ${poolId}
  `;
  return row ? { id: row.id, discount: discountFromDb(row.discount) } : null;
}

async function queryDelegation(address: Address): Promise<string | undefined> {
  let stakeCredential;
  try {
    const details = getAddressDetails(address);
    stakeCredential = details.stakeCredential;
    assert(stakeCredential, "No stake credential");
    const networkId = details.networkId;
    assert(
      networkId === networkToId(NETWORK),
      `Network mismatch: ${networkId} | ${NETWORK}`
    );
  } catch (_error) {
    return undefined;
  }
  const rewardAddress = credentialToRewardAddress(stakeCredential, NETWORK);
  const params = new URLSearchParams({ count: "1", order: "desc" });
  const response = await fetch(
    `${BLOCKFROST_URL}/accounts/${rewardAddress}/history?${params}`,
    { headers: { project_id: BLOCKFROST_PROJECT_ID } }
  );
  const result = await response.json();
  if (!result) throw new Error("empty blockfrost response");
  if (result.error) {
    // The reward address is a new one, just ignore it for this programme
    if (result.status_code === 404) return undefined;
    throw new Error(toJson(result));
  }
  return Array.isArray(result) && result.length ? result[0].pool_id : undefined;
}

async function queryEpochEnd(): Promise<UnixTimestamp> {
  const response = await fetch(`${BLOCKFROST_URL}/epochs/latest`, {
    headers: { project_id: BLOCKFROST_PROJECT_ID },
  });
  const result = await response.json();
  if (!result) throw new Error("empty blockfrost response");
  if (result.error) throw new Error(toJson(result));
  return result.end_time;
}

function referralToText(referral: Referral | null) {
  return referral ? `${referral.id}|${referral.discount}` : "";
}

function referralFromText(text: string): Referral | null {
  if (text) {
    const [id, discount] = text.split("|");
    return { id, discount: Number(discount) };
  } else {
    return null;
  }
}

function credentialToRewardAddress(
  stakeCredential: Credential,
  network: Network
) {
  return C.RewardAddress.new(
    networkToId(network),
    stakeCredential.type === "Key"
      ? C.StakeCredential.from_keyhash(
          C.Ed25519KeyHash.from_hex(stakeCredential.hash)
        )
      : C.StakeCredential.from_scripthash(
          C.ScriptHash.from_hex(stakeCredential.hash)
        )
  )
    .to_address()
    .to_bech32(undefined);
}

function epochExp(epochEnd: UnixTimestamp) {
  // It's sensitive near epoch end boundary
  return Math.round(Math.max(epochEnd, Date.now() + 60000) / 1000);
}

import { Address, Core, Lucid } from "lucid-cardano";

import { Kolour } from "./types/Kolours";

import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";

export const QUOTATION_TTL = 600; // 10 minutes
export const DISCOUNT_MULTIPLIER = 10000;

export function parseKolour(text: unknown): Kolour | undefined {
  if (text && typeof text === "string" && /^[0-9A-Fa-f]{6}$/.test(text))
    return text.toUpperCase();
  return undefined;
}

export function lookupReferral(_address: Address): string | undefined {
  // TODO: Lookup stake pool
  return undefined;
}

export async function fetchDiscount(sql: Sql, referral: string | undefined) {
  if (!referral) return undefined;
  const [row]: [{ discount: string }?] = await sql`
    SELECT discount FROM kolours.referral
    WHERE code = ${referral}
  `;
  return row
    ? BigInt(Math.trunc(Number(row.discount) * DISCOUNT_MULTIPLIER))
    : undefined;
}

export function calculateDiscountedFee(listedFee: Lovelace, discount?: bigint) {
  return discount
    ? listedFee - (listedFee * discount) / BigInt(DISCOUNT_MULTIPLIER)
    : listedFee;
}

export function getExpirationTime(now?: number): number {
  let unixSecs = Math.trunc((now ?? Date.now()) / 1000);
  // Less signature leak
  unixSecs -= unixSecs % 60;
  return unixSecs + QUOTATION_TTL;
}

export function getTxExp(lucid: Lucid, txBody: Core.TransactionBody) {
  const txTtl = txBody.ttl();
  if (txTtl == null) return null;
  const slot = Number(txTtl.to_str());
  const time = lucid.utils.slotToUnixTime(slot);
  return { slot, time };
}

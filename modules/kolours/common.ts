import { Address, Core, Lucid } from "lucid-cardano";

import { LovelaceAmount } from "../business-types";

import { Kolour } from "./types/Kolours";

import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";

export const QUOTATION_TTL = 600; // 10 minutes
export const DISCOUNT_MULTIPLIER = 10000;

export const FEE_MULTIPLIER = BigInt(2);

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
    WHERE id = ${referral}
  `;
  return row
    ? BigInt(Math.trunc(Number(row.discount) * DISCOUNT_MULTIPLIER))
    : undefined;
}

export function calculateFees(
  baseFee: Lovelace,
  discount?: bigint
): { listedFee: Lovelace; fee: Lovelace } {
  const fee = discount
    ? baseFee - (baseFee * discount) / BigInt(DISCOUNT_MULTIPLIER)
    : baseFee;
  const listedFee = baseFee * FEE_MULTIPLIER;
  return { fee, listedFee };
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

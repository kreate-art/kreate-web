import { Address } from "lucid-cardano";

import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";

export const QUOTATION_TTL = 600; // 10 minutes

export type Kolour = string; // RRGGBB

export type KolourEntry = {
  fee: Lovelace;
  listedFee: Lovelace;
  image: string; // ipfs://<cid>
};

export type KolourQuotation = {
  kolours: Record<Kolour, KolourEntry>;
  userAddress: Address;
  feeAddress: Address;
  expiration: number; // Unix Timestamp in seconds
} & ExtraParams;

// Reserved for future usage :)
export type ExtraParams = {
  referral?: string;
};

export function parseKolour(text: unknown): Kolour | undefined {
  if (text && typeof text === "string" && /^[0-9A-Fa-f]{6}$/.test(text))
    return text.toUpperCase();
  return undefined;
}

export function parseReferral(text: unknown): string | undefined {
  if (text && typeof text === "string") return text.toUpperCase();
  return undefined;
}

export async function getDiscount(sql: Sql, referral: string | undefined) {
  if (!referral) return undefined;
  const [row]: [{ discount: string }?] = await sql`
    SELECT discount FROM kolours.referral
    WHERE code = ${referral}
  `;
  return row ? BigInt(Math.trunc(Number(row.discount) * 10000)) : undefined;
}

export function calculateKolourFee(
  kolour: Kolour,
  discount?: bigint // Multiplied by 1E4
): { fee: Lovelace; listedFee: Lovelace } {
  // TODO: Finalize price formula ;)
  const listedFee = BigInt(
    Buffer.from(kolour, "hex").reduce((sum, v) => sum + v * 1_000, 2_000_000)
  );
  const fee = discount
    ? listedFee - (listedFee * discount) / BigInt(10000)
    : listedFee;
  return { fee, listedFee };
}

export async function areKoloursAvailable(
  sql: Sql,
  kolours: Kolour[]
): Promise<boolean> {
  if (!kolours.length) return true;
  const res = await sql`
    SELECT FROM kolours.kolour_book
    WHERE
      kolour IN ${sql(kolours)}
      AND status <> 'expired';
  `;
  return res.count === 0;
}

export async function getUnavailableKolours(
  sql: Sql,
  kolours: Kolour[]
): Promise<Set<Kolour>> {
  if (!kolours.length) return new Set();
  const rows = await sql<{ kolour: Kolour }[]>`
    SELECT kolour FROM kolours.kolour_book
    WHERE
      kolour IN ${sql(kolours)}
      AND status <> 'expired';
  `;
  return new Set(rows.map((r) => r.kolour));
}

export const KOLOUR_IMAGE_CID_PREFIX = "ko:kolour:img:";
export const KOLOUR_IMAGE_LOCK_PREFIX = "ko:kolour:img.lock:";

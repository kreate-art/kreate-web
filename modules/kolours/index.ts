import { Address } from "lucid-cardano";

import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";

export const QUOTATION_TTL = 600; // 10 minutes

export type Kolour = string; // RRGGBB

export type KolourListing = {
  fee: Lovelace;
  image: string; // ipfs://<cid>
};

export type KolourQuotation = {
  kolours: Record<Kolour, KolourListing>;
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

export function calculateKolourFee(
  kolour: Kolour,
  _address: Address,
  _extra: ExtraParams
) {
  // TODO: Finalize price formula ;)
  return BigInt(
    Buffer.from(kolour, "hex").reduce((sum, v) => sum + v * 1_000, 2_000_000)
  );
}

export async function areKoloursAvailable(
  sql: Sql,
  kolours: Kolour[]
): Promise<boolean> {
  if (!kolours.length) return true;
  const res = await sql`
    SELECT
    FROM
      kolours.kolour_book
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
    SELECT
      kolour
    FROM
      kolours.kolour_book
    WHERE
      kolour IN ${sql(kolours)}
      AND status <> 'expired';
  `;
  return new Set(rows.map((r) => r.kolour));
}

export const KOLOUR_IMAGE_CID_PREFIX = "ko:kolour:img:";
export const KOLOUR_IMAGE_LOCK_PREFIX = "ko:kolour:img.lock:";

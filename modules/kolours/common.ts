import { Sql } from "@/modules/next-backend/db";

export const QUOTATION_TTL = 600; // 10 minutes

export type Kolour = string; // RRGGBB

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

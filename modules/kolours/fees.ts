import { Kolours } from "./types";

import { Lovelace } from "@/modules/next-backend/types";

export const DISCOUNT_MULTIPLIER = 10000;

export const FEE_MULTIPLIER = BigInt(2);

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
      4_000_000,
      Buffer.from(kolour, "hex").reduce((sum, v) => sum * 1000 + v, 0)
    )
  );
}

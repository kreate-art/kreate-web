import {
  DISCOUNT_MULTIPLIER,
  DISCOUNT_MULTIPLIER_BI,
  Kolour,
} from "./types/Kolours";

import { Lovelace } from "@/modules/next-backend/types";

export function discountFromDb(data: string) {
  return Math.trunc(Number(data) * DISCOUNT_MULTIPLIER);
}

export function applyDiscount(fee: Lovelace, discount: number) {
  return (
    (fee * BigInt(DISCOUNT_MULTIPLIER - discount)) / DISCOUNT_MULTIPLIER_BI
  );
}

export function computeFee(
  listedFee: Lovelace,
  baseDiscount: number,
  referralDiscount?: number
): Lovelace {
  const base = applyDiscount(listedFee, baseDiscount);
  return referralDiscount ? applyDiscount(base, referralDiscount) : base;
}

export function calculateKolourFee(kolour: Kolour): Lovelace {
  return BigInt(
    Math.max(
      4_000_000,
      Buffer.from(kolour, "hex").reduce((sum, v) => sum * 1000 + v, 0)
    )
  );
}

import { Address } from "lucid-cardano";

import { redis } from "../next-backend/connections";

import { assert } from "@/modules/common-utils";
import { Lovelace } from "@/modules/next-backend/types";

export const QUOTATION_TTL = 600; // 10 minutes

export type Kolour = string; // RRGGBB

export type KolourListing = {
  fee: Lovelace;
  image: string; // ipfs://<cid>
};

export type Quotation = {
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
  kolours: Kolour[]
): Promise<Record<Kolour, boolean>> {
  // TODO: Differentiate between "booked" and "minted"
  const count = kolours.length;
  if (count === 0) return {};
  else if (count === 1) {
    const [kolour] = kolours;
    return { [kolour]: !(await redis.exists(KO_LOCK_PREFIX + kolour)) };
  } else {
    const pipeline = redis.pipeline();
    for (const kolour of kolours) pipeline.exists(KO_LOCK_PREFIX + kolour);
    const replies = await pipeline.exec();
    assert(replies, "pipeline: replies must not be null");
    return Object.fromEntries(
      replies.map(([error, locked], index) => {
        const kolour = kolours[index];
        if (error)
          throw new Error(`unable to check availability for: ${kolour}`, {
            cause: error,
          });
        return [kolour, !locked];
      })
    );
  }
}

export const KO_LOCK_PREFIX = "ko:x:";
export const KO_IMAGE_CID_PREFIX = "ko:img:";
export const KO_IMAGE_LOCK_PREFIX = "ko:img.lock:";

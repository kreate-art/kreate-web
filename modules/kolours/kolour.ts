import { randomUUID } from "crypto";

import { Redis } from "ioredis";
import { IPFSHTTPClient } from "ipfs-http-client/dist/src/types";
import sharp from "sharp";

import { Kolour } from "./types/Kolours";

import { Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";
import { Lovelace } from "@/modules/next-backend/types";

const IMAGE_OPTIONS: Omit<sharp.Create, "background"> = {
  width: 128,
  height: 128,
  channels: 3,
};

export function calculateKolourFee(kolour: Kolour): Lovelace {
  return BigInt(
    Math.max(
      2_000_000,
      Buffer.from(kolour, "hex").reduce((sum, v) => sum * 1000 + v, 0)
    )
  );
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

export async function generateKolourImageCid(
  redis: Redis,
  ipfs: IPFSHTTPClient,
  kolour: Kolour
) {
  const cidKey = KOLOUR_IMAGE_CID_PREFIX + kolour;
  let cachedCid = await redis.get(cidKey);
  if (cachedCid) return cachedCid;

  const imageLockKey = KOLOUR_IMAGE_LOCK_PREFIX + kolour;
  const imageLock = await locking.acquire(imageLockKey, randomUUID(), {
    ttl: 5,
  });
  try {
    // Fetch again, just in case the image was already processed, better use WATCH
    cachedCid = await redis.get(cidKey);
    if (cachedCid) return cachedCid;
    const image = await createKolourImage(kolour);
    const { cid } = await ipfs.add(image, { pin: true });
    const cidStr = cid.toString();
    await redis.set(cidKey, cidStr, "EX", 86400); // 1 day
    return cidStr;
  } finally {
    imageLock.release();
  }
}

export async function createKolourImage(kolour: Kolour): Promise<Buffer> {
  return sharp({
    create: { ...IMAGE_OPTIONS, background: `#${kolour}` },
  })
    .png({ colors: 2 })
    .toBuffer();
}

export const KOLOUR_IMAGE_CID_PREFIX = "ko:kolour:img:";
export const KOLOUR_IMAGE_LOCK_PREFIX = "ko:kolour:img.lock:";

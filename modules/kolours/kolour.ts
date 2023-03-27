import { randomUUID } from "node:crypto";

import { Redis } from "ioredis";
import { IPFSHTTPClient } from "ipfs-http-client/dist/src/types";
import sharp from "sharp";

import { LovelaceAmount } from "../business-types";

import { Kolour } from "./types/Kolours";

import { Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";

const IMAGE_OPTIONS: Omit<sharp.Create, "background"> = {
  width: 128,
  height: 128,
  channels: 3,
};

type KolourDbRow = {
  id: number;
  kolour: Kolour;
  slot: number;
  txId: string;
  metadata: unknown;
  status: string;
  userAddress: string;
  fee: LovelaceAmount;
  expectedEarning: LovelaceAmount;
};

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

export async function getAllMintedKolours(sql: Sql): Promise<KolourDbRow[]> {
  const rows = await sql<KolourDbRow[]>`
    SELECT
      km.id,
      km.kolour,
      km.slot,
      km.tx_id,
      km.metadata,
      kf.status,
      kb.user_address,
      kb.fee,
      SUM(COALESCE(kf.fee / 100, gk.listed_fee / 200)) AS expected_earning
    FROM kolours.kolour_mint km
    LEFT JOIN kolours.kolour_book kb
      ON km.kolour = kb.kolour
    LEFT JOIN (
      SELECT
        (p.item->>'k') AS kolour,
        gkl.listed_fee,
        gkl.kreation
      FROM
        kolours.genesis_kreation_list gkl,
        jsonb_array_elements(gkl.palette)
      WITH ORDINALITY p(item, idx)
    ) gk
    ON km.kolour = gk.kolour
    LEFT JOIN
      kolours.genesis_kreation_book kf
    ON gk.kreation = kf.kreation
    GROUP BY
      km.id,
      km.kolour,
      km.slot,
      km.tx_id,
      km.metadata,
      kf.status,
      kb.fee,
      kb.user_address
    ORDER BY
      km.id ASC
  `;
  return rows.slice();
}

export async function generateKolourImageCid(
  redis: Redis,
  ipfs: IPFSHTTPClient,
  kolour: Kolour
) {
  const cidKey = KOLOUR_IMAGE_CID_PREFIX + kolour;
  let cached = await redis.get(cidKey);
  if (cached) return cached;

  const lockKey = KOLOUR_IMAGE_LOCK_PREFIX + kolour;
  const lock = await locking.acquire(lockKey, randomUUID(), { ttl: 5 }, 200);
  try {
    // Fetch again, just in case the image was already processed, better use WATCH
    cached = await redis.get(cidKey);
    if (cached) return cached;
    const image = await createKolourImage(kolour);
    const { cid } = await ipfs.add(image, { pin: true });
    const cidStr = cid.toString();
    await redis.set(cidKey, cidStr, "EX", 86400); // 1 day
    return cidStr;
  } finally {
    lock.release();
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

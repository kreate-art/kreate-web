import { randomUUID } from "node:crypto";

import { Redis } from "ioredis";
import { IPFSHTTPClient } from "ipfs-http-client/dist/src/types";
import { Address } from "lucid-cardano";
import sharp from "sharp";

import { ClientError } from "../next-backend/api/errors";

import { discountFromDb } from "./fees";
import { KOLOUR_IMAGE_CID_PREFIX, KOLOUR_IMAGE_LOCK_PREFIX } from "./keys";
import { GenesisKreationId, Kolour, MintedKolourEntry } from "./types/Kolours";

import { Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";

const IMAGE_OPTIONS: Omit<sharp.Create, "background"> = {
  width: 128,
  height: 128,
  channels: 3,
};

export async function areKoloursAvailable(
  sql: Sql,
  kolours: Kolour[]
): Promise<boolean> {
  if (!kolours.length) return true;
  const res = await sql`
    SELECT
    FROM kolours.kolour_book
    WHERE
      kolour IN ${sql(kolours)}
      AND status <> 'expired';
  `;
  return !res.count;
}

export async function getGenesisKreationWithKolours(
  sql: Sql,
  kreation: GenesisKreationId,
  kolours: Kolour[]
) {
  const [row]: [{ baseDiscount: string; available: number }?] = await sql`
    SELECT
      gl.base_discount,
      count(1)::integer AS available
    FROM
      kolours.genesis_kreation_list gl
      INNER JOIN kolours.genesis_kreation_palette gp ON gp.kreation_id = gl.id
      LEFT JOIN kolours.kolour_book kb ON kb.kolour = gp.kolour
    WHERE
      gl.kreation = ${kreation}
      AND gp.kolour IN ${sql(kolours)}
      AND (kb.status IS NULL OR kb.status = 'expired')
    GROUP BY
      gl.base_discount
  `;
  return row
    ? {
        baseDiscount: discountFromDb(row.baseDiscount),
        available: row.available,
      }
    : null;
}

export async function getAllMintedKolours(
  sql: Sql
): Promise<MintedKolourEntry[]> {
  const rows = await sql<MintedKolourEntry[]>`
    WITH kolour_earning AS (
      SELECT
        gp.kolour,
        sum(coalesce(gb.fee, gl.listed_fee * gl.base_discount) / 100)::bigint AS expected_earning
      FROM
        kolours.genesis_kreation_list gl
        LEFT JOIN kolours.genesis_kreation_book gb
          ON gb.kreation = gl.kreation
            AND gb.status <> 'expired'
        INNER JOIN kolours.genesis_kreation_palette gp
          ON gp.kreation_id = gl.id
      GROUP BY
        gp.kolour
    )
    SELECT
      kb.kolour,
      kb.user_address,
      kb.fee,
      ke.expected_earning
    FROM
      kolours.kolour_book kb
      LEFT JOIN kolour_earning ke
        ON ke.kolour = kb.kolour
    WHERE
      kb.status <> 'expired'
    ORDER BY
      kb.id ASC
  `;
  return rows.slice();
}

export async function getFreeMintQuota(sql: Sql, address: Address) {
  const [{ total, used }] = await sql<[{ total: number; used: number }]>`
    SELECT
      coalesce(
      (
        SELECT
          quota
        FROM
          kolours.kolour_free_mint
        WHERE
          address = ${address}
      ), 0) total,
      (
        SELECT
          count(id)::integer
        FROM
          kolours.kolour_book
        WHERE
          status <> 'expired'
          AND source = 'free'
          AND user_address = ${address}
      ) used;
  `;
  const available = total - used;
  return { total, available, used };
}

export async function areKoloursAvailableForFreeMint(
  sql: Sql,
  kolours: Kolour[]
): Promise<boolean> {
  if (!kolours.length) return true;
  const res = await sql`
    SELECT FROM (
      SELECT kolour FROM kolours.kolour_book WHERE status <> 'expired'
      UNION ALL
      SELECT kolour FROM kolours.genesis_kreation_palette
    ) AS _
    WHERE
      kolour IN ${sql(kolours)}
  `;
  return !res.count;
}

export async function checkFreeMintAvailability(
  sql: Sql,
  address: Address,
  kolours: Kolour[]
) {
  const [quota, areAvailable] = await Promise.all([
    getFreeMintQuota(sql, address),
    areKoloursAvailableForFreeMint(sql, kolours),
  ]);
  ClientError.assert(areAvailable, {
    _debug: "kolours are unavailable for free mint",
  });
  ClientError.assert(quota.total, {
    _debug: "not eligible for free mint",
  });
  ClientError.assert(quota.available >= kolours.length, {
    _debug: `insufficient quota for free mint: need ${kolours.length}, have ${quota.available}`,
  });
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
    await lock.release();
  }
}

export async function createKolourImage(kolour: Kolour): Promise<Buffer> {
  return sharp({
    create: { ...IMAGE_OPTIONS, background: `#${kolour}` },
  })
    .png({ colors: 2 })
    .toBuffer();
}

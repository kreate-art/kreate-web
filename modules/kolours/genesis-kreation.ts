import { randomUUID } from "node:crypto";
import stream from "node:stream";

import { Redis } from "ioredis";
import sharp from "sharp";

import { calculateKolourFee, computeFee, discountFromDb } from "./fees";
import {
  KOLOUR_MERGED_LAYERS_CID_PREFIX,
  KOLOUR_MERGED_LAYERS_LOCK_PREFIX,
} from "./keys";
import {
  GenesisKreation$Gallery,
  GenesisKreation$Mint,
  GenesisKreationId,
  GenesisKreationSlug,
  GenesisKreationStatus,
  Layer,
} from "./types/Kolours";

import { noop } from "@/modules/common-utils";
import { ClientError } from "@/modules/next-backend/api/errors";
import type { Ipfs } from "@/modules/next-backend/connections";
import { postgres, Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";
import { Lovelace } from "@/modules/next-backend/types";
import { Cid } from "@/modules/next-backend/utils/CodecCid";
import { getIpfsUrl } from "@/modules/urls";

// TODO: Split into 2 types
type GenesisKreationDbRow = {
  slug: GenesisKreationSlug;
  kreation: GenesisKreationId;
  initialImageCid: string;
  finalImageCid: string;
  listedFee: bigint;
  baseDiscount: string;
  createdAt: Date;
  mintedAt: Date;
  userAddress: string;
  fee: bigint;
  name: string;
  description: string[];
  status: GenesisKreationStatus;
  palette: string; // kolour|cid|status,...
};

export async function getAllGenesisKreationsForGallery(
  sql: Sql
): Promise<GenesisKreation$Gallery[]> {
  const rows = await sql<GenesisKreationDbRow[]>`
    SELECT
      gl.id,
      gl.slug,
      gl.kreation,
      gl.final_image_cid,
      gkt.address AS user_address,
      gb.fee,
      gb.name,
      gb.description,
      gb.created_at AS minted_at,
      string_agg(gp.kolour, ',' ORDER BY gp.id) AS palette
    FROM
      kolours.genesis_kreation_list gl
      LEFT JOIN kolours.genesis_kreation_book gb
        ON gl.kreation = gb.kreation
          AND gb.status <> 'expired'
      INNER JOIN kolours.genesis_kreation_palette gp
        ON gp.kreation_id = gl.id
      INNER JOIN (
        SELECT
          DISTINCT ON (kreation)
            address,
            kreation
          FROM
            kolours.genesis_kreation_trace
          ORDER BY
            kreation ASC, id DESC
      ) AS gkt
        ON gkt.kreation = gl.kreation
    GROUP BY
      gl.id,
      gb.id,
      gkt.address
    ORDER BY
      gl.id ASC
  `;
  return rows.map((row) => {
    const palette = row.palette.split(",");
    return {
      id: row.kreation,
      slug: row.slug,
      finalImage: { src: getIpfsUrl(row.finalImageCid) },
      fee: row.fee,
      mintedAt: row.mintedAt.valueOf(),
      palette,
      name: row.name,
      userAddress: row.userAddress,
      description: row.description,
    };
  });
}

export async function getAllGenesisKreationsForMint(
  sql: Sql,
  referralDiscount?: number
): Promise<GenesisKreation$Mint[]> {
  const rows = await sql<GenesisKreationDbRow[]>`
    SELECT
      gl.id,
      gl.slug,
      gl.kreation,
      gl.initial_image_cid,
      gl.final_image_cid,
      gl.base_discount,
      gl.created_at,
      gl.listed_fee,
      coalesce(gb.status::text, CASE WHEN bool_and(kb.status IS NOT DISTINCT FROM 'minted') THEN 'ready' ELSE 'unready' END) AS status,
      string_agg(concat(gp.kolour, '|', gp.layer_image_cid, '|', gp.mask_image_cid, '|', kb.status), ',' ORDER BY gp.id) AS palette
    FROM
      kolours.genesis_kreation_list gl
      LEFT JOIN kolours.genesis_kreation_book gb
        ON gl.kreation = gb.kreation
          AND gb.status <> 'expired'
      INNER JOIN kolours.genesis_kreation_palette gp
        ON gp.kreation_id = gl.id
      LEFT JOIN kolours.kolour_book kb
        ON kb.kolour = gp.kolour
          AND kb.status <> 'expired'
    GROUP BY
      gl.id,
      gb.id
    ORDER BY
      gl.id ASC
  `;
  return rows.map((row) => {
    const baseDiscount = discountFromDb(row.baseDiscount);
    const palette = row.palette.split(",").map((text): Layer => {
      const [kolour, layerCid, maskCid, status] = text.split("|");
      const listedFee = calculateKolourFee(kolour);
      const fee = computeFee(listedFee, baseDiscount, referralDiscount);
      return {
        kolour,
        image: { src: getIpfsUrl(layerCid) },
        mask: maskCid ? { src: getIpfsUrl(maskCid) } : undefined,
        status: (status as "booked" | "minted" | "") || "free",
        listedFee,
        fee,
      };
    });
    return {
      id: row.kreation,
      slug: row.slug,
      status: row.status,
      initialImage: { src: getIpfsUrl(row.initialImageCid) },
      finalImage: { src: getIpfsUrl(row.finalImageCid) },
      listedFee: row.listedFee,
      fee: computeFee(row.listedFee, baseDiscount, referralDiscount),
      palette,
      createdAt: row.createdAt.valueOf(),
    };
  });
}

export async function quoteGenesisKreation(
  sql: Sql,
  id: GenesisKreationId,
  referralDiscount?: number
) {
  const extra = sql`
    gl.base_discount,
    gl.final_image_cid AS image_cid,
    gl.listed_fee,
  `;
  const row = await queryGenesisKreation<{
    imageCid: string;
    baseDiscount: string;
    fee: Lovelace; // Deduced later
    listedFee: Lovelace;
  }>(sql, id, extra);
  if (row)
    row.fee = computeFee(
      row.listedFee,
      discountFromDb(row.baseDiscount),
      referralDiscount
    );
  return row;
}

export async function getGenesisKreationStatus(
  sql: Sql,
  id: GenesisKreationId
) {
  return (await queryGenesisKreation(sql, id))?.status ?? null;
}

async function queryGenesisKreation<T extends object = Record<string, never>>(
  sql: Sql,
  id: GenesisKreationId,
  extraSelect?: postgres.Fragment
): Promise<(T & { status: GenesisKreationStatus }) | null> {
  const [row]: [(T & { status: GenesisKreationStatus })?] = await sql`
    SELECT
      ${extraSelect ?? sql``}
      coalesce(gb.status::text, (
        SELECT
          CASE WHEN bool_and(kb.id IS NOT NULL) THEN 'ready' ELSE 'unready' END
        FROM
          kolours.genesis_kreation_palette gp
          LEFT JOIN kolours.kolour_book kb
            ON kb.kolour = gp.kolour
              AND kb.status = 'minted'
        WHERE
          gp.kreation_id = gl.id
      )) AS status
    FROM
      kolours.genesis_kreation_list gl
      LEFT JOIN kolours.genesis_kreation_book gb
        ON gl.kreation = gb.kreation
          AND gb.status <> 'expired'
    WHERE
      gl.kreation = ${id}
  `;
  return row ?? null;
}

// 30 days
const CACHED_MERGED_LAYERS_TTL = 3600 * 24 * 30;

export async function mergeGenesisKreationLayers(
  sql: Sql,
  ipfs: Ipfs,
  redis: Redis,
  slug: GenesisKreationSlug,
  layers: number[]
): Promise<{ cid: Cid; status: "hit" | "miss" | "stale-remake" }> {
  layers = [...layers].sort();
  layers = Array.from(new Set(layers));

  let cacheStatus: "hit" | "miss" | "stale-remake" = "miss";

  const redisKey =
    KOLOUR_MERGED_LAYERS_CID_PREFIX + `${slug}_${layers.join("|")}`;

  const lockKey =
    KOLOUR_MERGED_LAYERS_LOCK_PREFIX + `${slug}_${layers.join("|")}`;

  const fromCache = async () => {
    const cached = (await redis.get(redisKey)) as Cid | null;
    if (cached) {
      const existed = await cidExistsLocally(ipfs, cached);
      cacheStatus = existed ? "hit" : "stale-remake";
      return existed ? cached : null;
    } else {
      cacheStatus = "miss";
      return null;
    }
  };

  let cached = await fromCache();
  if (cached) return { cid: cached, status: cacheStatus };

  const lock = await locking.acquire(lockKey, randomUUID(), { ttl: 2 }, 300);
  try {
    if ((cached = await fromCache()))
      return { cid: cached, status: cacheStatus };
    const cid = await generateMergedLayerImage(sql, ipfs, slug, layers);
    redis.set(redisKey, cid, "EX", CACHED_MERGED_LAYERS_TTL);
    return { cid, status: cacheStatus };
  } finally {
    lock.release();
  }
}

async function generateMergedLayerImage(
  sql: Sql,
  ipfs: Ipfs,
  slug: GenesisKreationSlug,
  layers: number[]
) {
  const rows = await sql<{ layerImageCid: Cid; layerIndex: bigint }[]>`
    WITH kolour_layers AS (
      SELECT
        gl.initial_image_cid,
        gp.layer_image_cid,
        ROW_NUMBER() OVER (ORDER BY gp.id) AS layer_index
      FROM
        kolours.genesis_kreation_list gl
        INNER JOIN kolours.genesis_kreation_palette gp
          ON gp.kreation_id = gl.id
      WHERE
        gl.slug = ${slug}
    )

    SELECT
      kl.layer_image_cid,
      kl.layer_index
    FROM
      kolour_layers kl
      WHERE layer_index = ANY(${layers})
    UNION
      -- Add base layer
      (
        SELECT
          kl.initial_image_cid AS layer_image_cid,
          0 AS layer_index
        FROM
          kolour_layers kl
        LIMIT 1
      )
  `;

  const baseLayer = rows.find(
    (row) => row.layerIndex === BigInt(0)
  )?.layerImageCid;
  ClientError.assert(baseLayer, "genesis kreation not found", 404);

  const kolourLayers = rows
    .filter((row) => row.layerIndex !== BigInt(0))
    .map((row) => row.layerImageCid);

  const abortControllers = [];
  try {
    const controller = new AbortController();
    abortControllers.push(controller);

    const compositeLayers = await Promise.all(
      kolourLayers.map(async (cid) => {
        const iterator = ipfs.cat(`/ipfs/${cid}`, {
          timeout: 10_000,
          signal: controller.signal,
        });

        const chunks = [];
        for await (const chunk of iterator) {
          chunks.push(chunk);
        }

        return { input: Buffer.concat(chunks) };
      })
    );

    const compositor = sharp().composite(compositeLayers);
    const baseLayerStream = stream.Readable.from(
      ipfs.cat(`/ipfs/${baseLayer}`, { timeout: 10_000 })
    );

    const { cid } = await ipfs.add(
      stream.pipeline(baseLayerStream, compositor, noop),
      { pin: true }
    );
    return cid.toString();
  } catch (error) {
    abortControllers.forEach((c) => c.abort(error));
    throw error;
  }
}

function cidExistsLocally(ipfs: Ipfs, cid: Cid) {
  return ipfs.files
    .stat(`/ipfs/${cid}`, {
      timeout: 2_000,
      // @ts-expect-error this is a bug from ipfs-http-client. The correct type is URLSearchParams, but it
      // crashes when we provide one. See: https://github.com/ipfs/js-ipfs/pull/4341
      // Until the above PR resolved, let's use this workaround
      searchParams: { offline: true },
    })
    .then(() => true)
    .catch((error) => {
      if (ipfs.isOfflineError(error)) return false;
      throw error;
    });
}

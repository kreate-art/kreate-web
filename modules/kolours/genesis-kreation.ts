import { calculateKolourFee, computeFee, discountFromDb } from "./fees";
import {
  GenesisKreation$Gallery,
  GenesisKreation$Mint,
  GenesisKreationId,
  GenesisKreationSlug,
  GenesisKreationStatus,
  Layer,
} from "./types/Kolours";

import { postgres, Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";
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

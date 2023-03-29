import { calculateKolourFee, computeFees } from "./fees";
import {
  GenesisKreationEntry,
  GenesisKreationId,
  GenesisKreationStatus,
  Layer,
} from "./types/Kolours";

import { postgres, Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";
import { getIpfsUrl } from "@/modules/urls";

type GenesisKreationDbRow = {
  kreation: GenesisKreationId;
  initialImageCid: string;
  finalImageCid: string;
  baseFee: bigint;
  createdAt: Date;
  userAddress: string | null;
  fee: bigint | null;
  name: string | null;
  description: string | null;
  status: GenesisKreationStatus;
  palette: string; // kolour|cid|status,...
};

export async function getAllGenesisKreations(
  sql: Sql,
  discount?: bigint
): Promise<GenesisKreationEntry[]> {
  const rows = await sql<GenesisKreationDbRow[]>`
    SELECT
      gl.id,
      gl.kreation,
      gl.initial_image_cid,
      gl.final_image_cid,
      gl.listed_fee AS base_fee,
      gl.created_at,
      gb.user_address,
      gb.fee,
      gb.name,
      gb.description,
      coalesce(gb.status::text, CASE WHEN bool_and(kb.status IS NOT DISTINCT FROM 'minted') THEN 'ready' ELSE 'unready' END) AS status,
      string_agg(concat(gp.kolour, '|', gp.layer_image_cid, '|', kb.status), ',' ORDER BY gp.id) AS palette
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
      gl.kreation,
      gl.initial_image_cid,
      gl.final_image_cid,
      gl.listed_fee,
      gl.created_at,
      gb.user_address,
      gb.fee,
      gb.name,
      gb.description,
      gb.status
    ORDER BY
      gl.id ASC
  `;
  return rows.map((row) => {
    const palette = row.palette.split(",").map((text): Layer => {
      const [kolour, cid, status] = text.split("|");
      return {
        kolour,
        image: { src: getIpfsUrl(cid) },
        status: (status as "booked" | "minted" | "") || "free",
        ...computeFees(calculateKolourFee(kolour), discount),
      };
    });
    return {
      id: row.kreation,
      status: row.status,
      initialImage: { src: getIpfsUrl(row.initialImageCid) },
      finalImage: { src: getIpfsUrl(row.finalImageCid) },
      ...computeFees(row.baseFee, discount),
      palette,
      createdAt: row.createdAt.valueOf(),
      name: row.name,
      userAddress: row.userAddress,
      description: row.description,
    };
  });
}

export async function quoteGenesisKreation(
  sql: Sql,
  id: GenesisKreationId,
  discount?: bigint
) {
  const extra = sql`
    gl.final_image_cid AS image_cid,
    gl.listed_fee AS base_fee,
  `;
  const row = await queryGenesisKreation<{
    imageCid: string;
    baseFee: Lovelace;
    // Deduced later
    fee: Lovelace;
    listedFee: Lovelace;
  }>(sql, id, extra);
  row && Object.assign(row, computeFees(row.baseFee, discount));
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
      ))
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

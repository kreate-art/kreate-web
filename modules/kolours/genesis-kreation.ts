import { calculateKolourFee, computeFees } from "./fees";
import {
  GenesisKreationEntry,
  GenesisKreationId,
  GenesisKreationStatus,
  Kolour,
  Layer,
} from "./types/Kolours";

import { assert } from "@/modules/common-utils";
import { postgres, Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";
import { getIpfsUrl } from "@/modules/urls";

type GenesisKreationDbRow = {
  kreation: GenesisKreationId;
  initialImageCid: string;
  finalImageCid: string;
  baseFee: bigint;
  createdAt: Date;
  palette: { k: Kolour; l: string }[];
  bookStatus: "booked" | "minted" | null;
  userAddress: string | null;
  fee: bigint | null;
  name: string | null;
  description: string | null;
  koloursStatus: ("booked" | "minted" | "NULL" | null)[]; // SQL is dumb
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
      gl.palette,
      gb.status AS book_status,
      gb.user_address,
      gb.fee,
      gb.name,
      gb.description,
      array_agg(kb.status ORDER BY p.i) kolours_status
    FROM
      kolours.genesis_kreation_list gl
      LEFT JOIN kolours.genesis_kreation_book gb
        ON gl.kreation = gb.kreation
          AND gb.status <> 'expired'
      CROSS JOIN LATERAL
        ROWS FROM (jsonb_to_recordset(gl.palette) AS (k varchar(6)))
        WITH ORDINALITY p(k, i)
      LEFT JOIN kolours.kolour_book kb
        ON kb.kolour = p.k
          AND kb.status <> 'expired'
    GROUP BY
      gl.id,
      gl.kreation,
      gl.initial_image_cid,
      gl.final_image_cid,
      gl.listed_fee,
      gl.created_at,
      gl.palette,
      gb.status,
      gb.user_address,
      gb.fee,
      gb.name,
      gb.description
    ORDER BY
      gl.id ASC
  `;
  return rows.map((row) => {
    const r_palette = row.palette;
    const r_koStatus = row.koloursStatus;
    assert(r_palette.length === r_koStatus.length, "palette length not match");
    const r_status = row.bookStatus;

    const koStatus = r_koStatus.map((s) => (!s || s === "NULL" ? "free" : s));
    const status = r_status
      ? r_status
      : koStatus.every((s) => s === "minted")
      ? "ready"
      : "unready";
    const palette = r_palette.map(({ k, l }, i): Layer => {
      return {
        kolour: k,
        image: { src: getIpfsUrl(l) },
        status: koStatus[i],
        ...computeFees(calculateKolourFee(k), discount),
      };
    });
    return {
      id: row.kreation,
      status,
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
): Promise<(T & StatusOutField) | null> {
  const [row]: [(T & StatusInFields)?] = await sql`
    SELECT
      ${extraSelect ?? sql``}
      gb.status AS book_status,
      (
        SELECT
          bool_and(kb.id IS NOT NULL)
        FROM
          jsonb_to_recordset(gl.palette) AS p(k varchar(6))
          LEFT JOIN kolours.kolour_book kb
            ON kb.kolour = p.k
              AND kb.status = 'minted'
      ) AS is_ready
    FROM
      kolours.genesis_kreation_list gl
      LEFT JOIN kolours.genesis_kreation_book gb
        ON gl.kreation = gb.kreation
          AND gb.status <> 'expired'
    WHERE
      gl.kreation = ${id}
  `;
  if (row) {
    const { bookStatus, isReady, ...rest } = row;
    return {
      ...rest,
      status: bookStatus == null ? (isReady ? "ready" : "unready") : bookStatus,
    } as T & StatusOutField;
  } else {
    return null;
  }
}

type StatusInFields = {
  bookStatus: "booked" | "minted" | null;
  isReady: boolean;
};
type StatusOutField = {
  status: GenesisKreationStatus;
};

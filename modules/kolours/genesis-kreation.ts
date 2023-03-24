import { calculateKolourFee, computeFees } from "./fees";
import {
  GenesisKreationEntry,
  GenesisKreationId,
  GenesisKreationStatus,
  Kolour,
  Layer,
} from "./types/Kolours";

import { assert } from "@/modules/common-utils";
import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";
import { getIpfsUrl } from "@/modules/urls";

type GenesisKreationDbRow = {
  kreation: GenesisKreationId;
  initialImageCid: string;
  finalImageCid: string;
  baseFee: bigint;
  bookStatus: "booked" | "minted" | null;
  createdAt: Date;
  palette: { k: Kolour; l: string }[];
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
      gb.status AS book_status,
      gl.created_at,
      gl.palette,
      array_agg(kb.status) kolours_status
    FROM
      kolours.genesis_kreation_list gl
      LEFT JOIN kolours.genesis_kreation_book gb
        ON gl.kreation = gb.kreation
          AND gb.status <> 'expired',
      jsonb_array_elements(gl.palette) p
      LEFT JOIN kolours.kolour_book kb
        ON kb.kolour = p ->> 'k'
          AND kb.status <> 'expired'
    GROUP BY
      gl.id,
      gl.kreation,
      gl.initial_image_cid,
      gl.final_image_cid,
      gl.listed_fee,
      gb.status,
      gl.created_at,
      gl.palette
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
    };
  });
}

export async function quoteGenesisKreation(
  sql: Sql,
  id: GenesisKreationId,
  discount?: bigint
) {
  const [row]: [
    (StatusInFields & {
      imageCid: string;
      fee: Lovelace;
      listedFee: Lovelace;
      baseFee: Lovelace;
    })?
  ] = await sql`
    SELECT
      gl.final_image_cid AS image_cid,
      gl.listed_fee AS base_fee,
      gb.status AS book_status,
      ${fieldIsReady(sql)}
    FROM
      ${joinBook(sql)}
    WHERE
      gl.kreation = ${id}
  `;
  if (row) {
    const res = combineStatus(row);
    Object.assign(res, computeFees(row.baseFee, discount));
    return res;
  } else {
    return null;
  }
}

export async function getGenesisKreationStatus(
  sql: Sql,
  id: GenesisKreationId
) {
  const [row]: [StatusInFields?] = await sql`
    SELECT
      gb.status AS book_status,
      ${fieldIsReady(sql)}
    FROM
      ${joinBook(sql)}
    WHERE
      gl.kreation = ${id}
  `;
  return row ? combineStatus(row).status : null;
}

type StatusInFields = {
  bookStatus: "booked" | "minted" | null;
  isReady: boolean;
};
type StatusOutField = {
  status: GenesisKreationStatus;
};

function combineStatus<T extends StatusInFields>(
  row: T
): Omit<T, keyof StatusInFields> & StatusOutField {
  const { bookStatus, isReady, ...rest } = row;
  const status =
    bookStatus == null ? (isReady ? "ready" : "unready") : bookStatus;
  return { ...rest, status };
}

function fieldIsReady(sql: Sql) {
  return sql`
    (
      SELECT
        bool_and(kb.id IS NOT NULL)
      FROM
        kolours.genesis_kreation_list gl,
        jsonb_array_elements(gl.palette) p
      LEFT JOIN kolours.kolour_book kb ON kb.kolour = p ->> 'k'
        AND kb.status = 'minted'
    ) AS is_ready
  `;
}

function joinBook(sql: Sql) {
  return sql`
    kolours.genesis_kreation_list gl
    LEFT JOIN kolours.genesis_kreation_book gb
      ON gl.kreation = gb.kreation
        AND gb.status <> 'expired'
  `;
}

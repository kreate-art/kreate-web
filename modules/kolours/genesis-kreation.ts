import { Address } from "lucid-cardano";

import { calculateDiscountedFee, ExtraParams, Kolour } from "./common";

import { UnixTimestamp } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";
import { getIpfsUrl } from "@/modules/urls";

export type GenesisKreationId = string; // Act as token name also

export type GenesisKreationStatus = "unready" | "ready" | "booked" | "minted";

export type GenesisKreationQuotation = {
  id: GenesisKreationId;
  image: string; // ipfs://<cid>
  fee: Lovelace;
  listedFee: Lovelace;
  userAddress: Address;
  feeAddress: Address;
  expiration: number; // Unix Timestamp in seconds
} & ExtraParams;

type Image = { src: string };

type KolourLayer = {
  kolour: Kolour;
  image: Image;
  status: "free" | "booked" | "minted";
};

export type GenesisKreationEntry = {
  id: GenesisKreationId;
  status: GenesisKreationStatus;
  initialImage: Image;
  finalImage: Image;
  palette: KolourLayer[];
  fee: Lovelace;
  listedFee: Lovelace;
  createdAt: UnixTimestamp;
} & ExtraParams;

type GenesisKreationDbRow = {
  kreation: GenesisKreationId;
  initialImageCid: string;
  finalImageCid: string;
  listedFee: bigint;
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
      gl.listed_fee,
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
  return rows.map(
    ({
      kreation,
      palette: r_palette,
      koloursStatus: r_koStatuses,
      bookStatus,
      listedFee,
      initialImageCid,
      finalImageCid,
      createdAt,
    }) => {
      assert(
        r_palette.length === r_koStatuses.length,
        "palette length not match"
      );
      const koStatuses = r_koStatuses.map((s) =>
        !s || s === "NULL" ? "free" : s
      );
      const status = bookStatus
        ? bookStatus
        : koStatuses.every((s) => s === "minted")
        ? "ready"
        : "unready";
      const palette = r_palette.map(
        ({ k, l }, i): KolourLayer => ({
          kolour: k,
          image: { src: getIpfsUrl(l) },
          status: koStatuses[i],
        })
      );
      const fee = calculateDiscountedFee(listedFee, discount);
      return {
        id: kreation,
        status,
        initialImage: { src: getIpfsUrl(initialImageCid) },
        finalImage: { src: getIpfsUrl(finalImageCid) },
        palette,
        fee,
        listedFee,
        createdAt: createdAt.valueOf(),
      };
    }
  );
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
    })?
  ] = await sql`
    SELECT
      gl.final_image_cid AS image_cid,
      gl.listed_fee,
      gb.status AS book_status,
      ${fieldIsReady(sql)}
    FROM
      ${joinBook(sql)}
    WHERE
      gl.kreation = ${id}
  `;
  if (row) {
    const res = combineStatus(row);
    res.fee = calculateDiscountedFee(res.listedFee, discount);
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

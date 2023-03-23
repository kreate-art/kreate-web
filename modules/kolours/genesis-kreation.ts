import { Address } from "lucid-cardano";

import { ExtraParams } from "./common";

import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";

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

export async function quoteGenesisKreation(sql: Sql, id: GenesisKreationId) {
  const [row]: [
    (StatusInFields & {
      imageCid: string;
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
  return row ? combineStatus(row) : null;
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
        unnest(gl.palette) p
      LEFT JOIN kolours.kolour_book kb ON kb.kolour = p.kolour
        AND kb.status = 'minted'
    ) AS is_ready
  `;
}

function joinBook(sql: Sql) {
  return sql`
    kolours.genesis_kreation_list gl
    LEFT JOIN kolours.genesis_kreation_book gb ON gl.kreation = gb.kreation
      AND gb.status <> 'expired'
  `;
}

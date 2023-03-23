import { Address } from "lucid-cardano";

import { ExtraParams } from "./common";

import { Sql } from "@/modules/next-backend/db";
import { Lovelace } from "@/modules/next-backend/types";

export type GenesisKreationId = string; // Act as token name also

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
    {
      imageCid: string;
      listedFee: Lovelace;
      status: "free" | "booked" | "minted";
    }?
  ] = await sql`
    SELECT
      l.final_image_cid AS image_cid,
      l.listed_fee,
      coalesce(b.status::text, 'free') AS status
    FROM
      kolours.genesis_kreation_list l
      LEFT JOIN kolours.genesis_kreation_book b
        ON l.kreation = b.kreation AND b.status <> 'expired'
    WHERE
      l.kreation = ${id}
  `;
  return row;
}

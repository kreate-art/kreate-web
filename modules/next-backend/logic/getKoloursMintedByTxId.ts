import { Sql } from "../db";

type Params = {
  txId: string;
};

export type KoloursMintedByTxId$Response = {
  kolours: string[];
};

export default async function getKoloursMintedByTxId(
  sql: Sql,
  { txId }: Params
): Promise<KoloursMintedByTxId$Response> {
  const results = await sql<{ kolour: string }[]>`
    SELECT
      km.kolour
    FROM kolours.kolour_mint km
    WHERE km.tx_id = ${txId}
  `;
  return { kolours: results.map(({ kolour }) => kolour) };
}

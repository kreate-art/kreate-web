import { Sql } from "../db";

type Params = {
  txHash: string;
};

export type KoloursMintedByTxHash$Response = {
  kolour: string;
};

export default async function getKoloursMintedByTxHash(
  sql: Sql,
  { txHash }: Params
): Promise<KoloursMintedByTxHash$Response> {
  const results = await sql<{ kolour: string }[]>`
    SELECT
      km.kolour
    FROM kolours.kolour_mint km
    WHERE km.tx_id = ${txHash}
  `;
  if (results.length > 1) {
    console.warn(`More than 1 NFT, see this transaction: ${txHash}`);
  }
  return results[0];
}

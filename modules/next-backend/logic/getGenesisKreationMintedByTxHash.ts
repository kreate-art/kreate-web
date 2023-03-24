import { Sql } from "../db";

type Params = {
  txHash: string;
};

export type GenesisKreationMintedByTxHash$Response = {
  kreation: string;
};

export default async function getGenesisKreationMintedByTxHash(
  sql: Sql,
  { txHash }: Params
): Promise<GenesisKreationMintedByTxHash$Response> {
  const results = await sql<{ kreation: string }[]>`
    SELECT
      gkm.kreation
    FROM kolours.genesis_kreation_mint gkm
    WHERE gkm.tx_id = ${txHash}
  `;
  if (results.length > 1) {
    console.warn(`More than 1 NFT, see this transaction: ${txHash}`);
  }
  return results[0];
}

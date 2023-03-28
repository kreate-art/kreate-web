import { Sql } from "../db";

type Params = {
  txId: string;
};

export type GenesisKreationMintedByTxId$Response = {
  kreations: string[];
};

export default async function getGenesisKreationMintedByTxId(
  sql: Sql,
  { txId }: Params
): Promise<GenesisKreationMintedByTxId$Response> {
  const results = await sql<{ kreation: string }[]>`
    SELECT
      gkm.kreation
    FROM kolours.genesis_kreation_mint gkm
    WHERE gkm.tx_id = ${txId}
  `;
  if (results.length > 1) {
    console.warn(`More than 1 NFT, see this transaction: ${txId}`);
  }
  return { kreations: results.map(({ kreation }) => kreation) };
}

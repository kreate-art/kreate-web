import { NextApiRequest, NextApiResponse } from "next/types";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import getGenesisKreationMintedByTxId from "@/modules/next-backend/logic/getGenesisKreationMintedByTxId";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { txId } = req.query;
    ClientError.assert(txId && typeof txId === "string", "txId is required");
    const results = await getGenesisKreationMintedByTxId(db, { txId });
    sendJson(res.status(200), results);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

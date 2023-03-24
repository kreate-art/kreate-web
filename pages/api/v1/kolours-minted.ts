import { NextApiRequest, NextApiResponse } from "next/types";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import getKoloursMintedByTxHash from "@/modules/next-backend/logic/getKoloursMintedByTxHash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { txHash } = req.query;

    ClientError.assert(
      txHash && typeof txHash === "string",
      "txHash is required"
    );

    const results = await getKoloursMintedByTxHash(db, { txHash });

    sendJson(res.status(200), results);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

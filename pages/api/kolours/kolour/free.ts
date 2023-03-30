import { NextApiRequest, NextApiResponse } from "next/types";

import { getFreeMintQuota } from "@/modules/kolours/kolour";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";

type Response = {
  total: number;
  used: number;
};

export type KolourFree$Response = Response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { address } = req.query;
    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });
    const result = await getFreeMintQuota(db, address);
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

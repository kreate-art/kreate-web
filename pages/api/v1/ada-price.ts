import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { redis } from "@/modules/next-backend/connections";
import { lookupAdaPriceInfo } from "@/modules/next-backend/logic/getAdaPriceInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { status, response } = await lookupAdaPriceInfo(redis);
    res.setHeader("X-Kreate-Cache", status);
    sendJson(res.status(200), response);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

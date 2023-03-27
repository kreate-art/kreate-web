import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { redis } from "@/modules/next-backend/connections";
import { getAdaPriceInfo } from "@/modules/next-backend/logic/getAdaPriceInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await getAdaPriceInfo(redis);
    sendJson(res.status(200), response);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

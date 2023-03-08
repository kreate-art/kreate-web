import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import { getProtocolStatistics } from "@/modules/next-backend/logic/getProtocolStatistics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const protocolStatistics = await getProtocolStatistics(db);
    sendJson(res.status(200), { protocolStatistics });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

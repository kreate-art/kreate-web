import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { redis } from "@/modules/next-backend/connections";
import { getAdaHandleByAddresses } from "@/modules/next-backend/logic/getAdaHandleByAddresses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = req.query.address;
    ClientError.assert(query, { _debug: "Address must be specified" });
    const addresses = typeof query === "string" ? query.split(",") : query;
    const response = await getAdaHandleByAddresses(redis, { addresses });
    sendJson(res.status(200), response);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

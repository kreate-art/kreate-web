import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { authorizeRequest } from "@/modules/next-backend/utils/authorization";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const address = await authorizeRequest(req);
    // if (address == null) throw new Error("Something");

    sendJson(res.status(200), { address });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getProjectMatch } from "@/modules/next-backend/logic/getProjectMatch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId, relevantAddress } = req.query;

    ClientError.assert(
      typeof projectId === "string" && typeof relevantAddress === "string",
      { error: 43, _debug: "invalid request" }
    );

    const result = await getProjectMatch(db, {
      projectId,
      relevantAddress,
    });

    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

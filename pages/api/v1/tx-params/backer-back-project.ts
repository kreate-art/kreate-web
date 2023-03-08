import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import { getBackerBackProject } from "@/modules/next-backend/logic/getBackerBackProject";

/**
 * Given a `projectId`, returns the corresponding `TxParams$BackerBackProject$Response`
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId } = req.query;
    ClientError.assert(
      projectId && typeof projectId === "string",
      "projectId is required"
    );
    const txParams = await getBackerBackProject(db, { projectId });
    sendJson(res.status(200), { txParams });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

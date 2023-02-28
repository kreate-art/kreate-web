import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getCreatorCloseProject } from "@/modules/next-backend/logic/getCreatorCloseProject";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId } = req.query;
    ClientError.assert(typeof projectId === "string", "invalid request");
    const result = await getCreatorCloseProject(db, { projectId });
    sendJson(res.status(200), { txParams: result });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

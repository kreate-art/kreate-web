import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getCreatorCreateProject } from "@/modules/next-backend/logic/getCreatorCreateProject";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await getCreatorCreateProject(db);
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

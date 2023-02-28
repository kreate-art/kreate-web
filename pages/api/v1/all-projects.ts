import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import {
  fromQuery$GetAllProjects,
  getAllProjects,
} from "@/modules/next-backend/logic/getAllProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params = ClientError.try$(
      () => fromQuery$GetAllProjects(req.query),
      () => "invalid request"
    );
    ClientError.assert(
      !!params.searchQuery == !!params.searchMethod,
      "invalid request"
    );
    const result = await getAllProjects(db, params);
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

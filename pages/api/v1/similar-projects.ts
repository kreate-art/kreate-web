import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getSimilarProjects } from "@/modules/next-backend/logic/getSimilarProjects";

// @sk-umiuma: Can we join this with v1/all-projects?
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { active, tags_commaSeparated } = req.query;

    ClientError.assert(
      (!active ||
        (typeof active === "string" && /^(true|false)$/.test(active))) &&
        typeof tags_commaSeparated === "string",
      { error: 43, _debug: "invalid request" }
    );

    const result = await getSimilarProjects(db, {
      active: active === undefined ? undefined : active === "true",
      tags: tags_commaSeparated.split(","),
    });

    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

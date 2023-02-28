import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getAllPodcasts } from "@/modules/next-backend/logic/getAllPodcasts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { backedBy, createdSince, createdBefore } = req.query;

    ClientError.assert(
      (!backedBy || typeof backedBy === "string") &&
        (!createdSince ||
          (typeof createdSince === "string" &&
            /^[0-9]+$/.test(createdSince))) &&
        (!createdBefore ||
          (typeof createdBefore === "string" &&
            /^[0-9]+$/.test(createdBefore))),
      { error: 43, _debug: "invalid request" }
    );

    const podcasts = await getAllPodcasts(db, {
      backedBy,
      createdSince: Number(createdSince),
      createdBefore: Number(createdBefore),
    });

    sendJson(res.status(200), { podcasts });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

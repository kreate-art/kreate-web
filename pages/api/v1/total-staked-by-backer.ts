import { Hex } from "@teiki/protocol/types";
import { Address } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getTotalStakedByBacker } from "@/modules/next-backend/logic/getTotalStakedByBacker";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { backerAddress, projectId } = req.query;
    const result = await getTotalStakedByBacker(db, {
      backerAddress: backerAddress as Address,
      projectId: projectId as Hex,
    });

    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

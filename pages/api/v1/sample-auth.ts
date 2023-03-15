import { Hex } from "@teiki/protocol/types";
import { Address } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import * as Auth from "@/modules/authorization";
import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import { getTotalStakedByBacker } from "@/modules/next-backend/logic/getTotalStakedByBacker";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId } = req.query;
    const address = await Auth.authorizeRequest(req);

    const result = await getTotalStakedByBacker(db, {
      backerAddress: address as Address,
      projectId: projectId as Hex,
    });
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

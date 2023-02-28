import { NextApiRequest, NextApiResponse } from "next";

import { toJson } from "@/modules/json-utils";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { db } from "@/modules/next-backend/db";
import { getCreatorWithdrawFund } from "@/modules/next-backend/logic/getCreatorWithdrawFund";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId } = req.query;

    ClientError.assert(typeof projectId === "string", {
      error: 43,
      _debug: "invalid request",
    });

    const result = await getCreatorWithdrawFund(db, { projectId });

    res.status(200).send(toJson({ txParams: result }));
  } catch (error) {
    apiCatch(req, res, error);
  }
}

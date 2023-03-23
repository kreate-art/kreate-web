import { NextApiRequest, NextApiResponse } from "next";

import { fetchDiscount, lookupReferral } from "@/modules/kolours/common";
import {
  GenesisKreationEntry,
  getAllGenesisKreations,
} from "@/modules/kolours/genesis-kreation";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";

type Response = { kreations: GenesisKreationEntry[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });
    const { address } = req.query;
    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });
    const referral = lookupReferral(address);
    const discount = referral ? await fetchDiscount(db, referral) : undefined;
    const kreations = await getAllGenesisKreations(db, discount);

    sendJson(res, { kreations } satisfies Response);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

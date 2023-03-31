import { NextApiRequest, NextApiResponse } from "next";

import { getAllGenesisKreations } from "@/modules/kolours/genesis-kreation";
import { GenesisKreationList } from "@/modules/kolours/types/Kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });
    const kreations = await getAllGenesisKreations(db, { preset: "gallery" });

    sendJson(res, { kreations } satisfies GenesisKreationList);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

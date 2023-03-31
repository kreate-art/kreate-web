import { NextApiRequest, NextApiResponse } from "next";

import { getAllGenesisKreationsForGallery } from "@/modules/kolours/genesis-kreation";
import { GenesisKreation$Gallery } from "@/modules/kolours/types/Kolours";
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
    const kreations = await getAllGenesisKreationsForGallery(db);

    sendJson(res, { kreations } satisfies {
      kreations: GenesisKreation$Gallery[];
    });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

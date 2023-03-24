import { NextApiRequest, NextApiResponse } from "next";

import { getAllMintedKolours } from "@/modules/kolours/kolour";
import { MintedKolourEntry } from "@/modules/kolours/types/Kolours";
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

    const kolours = await getAllMintedKolours(db);

    sendJson(res, { kolours } satisfies { kolours: MintedKolourEntry[] });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

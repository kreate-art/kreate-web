import { NextApiRequest, NextApiResponse } from "next";

import { getMintedKolours } from "@/modules/kolours/kolour";
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
    const { kolour } = req.query;
    ClientError.assert(
      typeof kolour === "string" && /^[0-9A-F]{6}$/.test(kolour),
      { _debug: "invalid request" }
    );

    const kolours = await getMintedKolours(db, { kolour });
    if (kolours.length > 1) {
      console.warn(`Multiple instances of kolour #${kolour}`);
    }
    ClientError.assert(kolours.length, { _debug: "kolour not minted" });
    sendJson(res, { mintedKolour: kolours[0] } satisfies {
      mintedKolour: MintedKolourEntry;
    });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

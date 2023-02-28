import { createHash } from "node:crypto";

import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getLogos } from "@/modules/next-backend/logic/getLogos";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "POST", { error: 405 });
    const body = req.body;
    ClientError.assert(body != null, {
      error: 11,
      _debug: "empty body",
    });

    const { letter, keywords, count } = body;
    ClientError.assert(
      typeof letter === "string" &&
        letter.length === 1 &&
        (count === undefined ||
          (typeof count === "number" &&
            count >= 1 &&
            count <= 5 &&
            count === Math.trunc(count))) &&
        keywords &&
        keywords instanceof Array &&
        keywords.length,
      {
        error: 13,
        _debug: "invalid request",
      }
    );

    const hash = createHash("sha256");
    for (const key of keywords) {
      ClientError.assert(typeof key === "string" && key.length, {
        error: 12,
        _debug: "keyword is not a string",
      });
      hash.update(key.trim().toLowerCase());
    }

    // TODO: ICPC & IOI medalists please help me
    let seed = 0;
    const digest = hash.digest();
    digest.forEach((b) => (seed += (b - 128) / 128));
    seed /= digest.length;

    const logos = await getLogos(db, letter, seed, count);
    sendJson(res.status(200), { logos });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

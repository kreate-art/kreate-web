import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { pinToIpfs } from "@/modules/next-backend/logic/postIpfsPin";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: Use AsyncIterator
  try {
    ClientError.assert(req.method === "POST", {
      _debug: "invalid http method",
    });
    const result = await pinToIpfs(req);
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

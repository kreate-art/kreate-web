import { NextApiRequest, NextApiResponse } from "next";

import { toJson } from "@/modules/json-utils";
import { db } from "@/modules/next-backend/db";
import { getTopTags } from "@/modules/server/search-bar";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const results = await getTopTags(db);
    res.status(200).send(toJson(results));
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : toJson(error));
  }
}

import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { db } from "@/modules/next-backend/connections";
import { getBackingDataByProject } from "@/modules/next-backend/logic/getBackingDataByProject";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId } = req.query;

    ClientError.assert(projectId && typeof projectId === "string", {
      _debug: "Invalid request",
    });

    const writeLine = (...row: string[]) => res.write(row.join(", ") + "\n");
    const { cursor } = await getBackingDataByProject(db, {
      projectId,
    });
    const filename = `backings-${projectId}-${moment().format(
      "YYYY-MM-DD-HH-mm-ss"
    )}.csv`;
    res
      .status(200)
      .setHeader("Content-Type", "text/csv; charset=utf-8")
      .setHeader("Content-Disposition", `attachment; filename="${filename}`);
    writeLine("address", "action", "amount", "time");
    const lovelaceOptions = {
      useMaxPrecision: true,
      excludeThousandsSeparator: true,
    };
    for await (const rows of cursor)
      for (const row of rows)
        writeLine(
          row.actorAddress,
          row.action,
          formatLovelaceAmount(row.amount, lovelaceOptions),
          row.time.toISOString()
        );
    res.end();
  } catch (error) {
    apiCatch(req, res, error);
  }
}

import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getDetailedProject } from "@/modules/next-backend/logic/getDetailedProject";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { active, customUrl, projectId, ownerAddress, preset } = req.query;

    ClientError.assert(
      (!active ||
        (typeof active === "string" && /^(true|false)$/.test(active))) &&
        (!customUrl || typeof customUrl === "string") &&
        (!projectId || typeof projectId === "string") &&
        (!ownerAddress || typeof ownerAddress === "string") &&
        (customUrl || projectId || ownerAddress),
      { _debug: "Invalid request" }
    );

    ClientError.assert(
      preset === "minimal" || preset === "basic" || preset === "full",
      "invalid preset"
    );

    const result = await getDetailedProject(db, {
      active: active === undefined ? undefined : active === "true",
      customUrl,
      projectId,
      ownerAddress,
      preset,
    });

    // IIFE (https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
    const response = (() => {
      switch (result.error) {
        case null:
          return { project: result.project };
        case "not-found":
          return { error: 48, _debug: result };
      }
    })();

    sendJson(res.status(200), response);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

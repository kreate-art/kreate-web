import { Hex } from "@teiki/protocol/types";
import { Address } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import { ClientError, apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/db";
import { getProjectTeikiRewardsByBacker } from "@/modules/next-backend/logic/getProjectTeikiRewardsByBacker";
import { getTotalStakedByBacker } from "@/modules/next-backend/logic/getTotalStakedByBacker";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId, backerAddress, legacy } = req.query;

  ClientError.assert(
    projectId && typeof projectId === "string",
    "projectId is required"
  );
  ClientError.assert(
    backerAddress && typeof backerAddress === "string",
    "backerAddress is required"
  );
  ClientError.assert(
    !legacy || typeof legacy === "string",
    "legacy must not be a list"
  );

  try {
    const { backerAddress, projectId } = req.query;
    const teikiRewards = await getProjectTeikiRewardsByBacker(legacy != null, {
      backerAddress: backerAddress as Address,
      projectId: projectId as Hex,
    });

    const totalStaked = await getTotalStakedByBacker(db, {
      backerAddress: backerAddress as Address,
      projectId: projectId as Hex,
    });

    sendJson(res.status(200), {
      history: {
        projectId,
        backerAddress,
        numMicroTeikiUnclaimed: teikiRewards.amount,
        numLovelaceBacked: totalStaked.amount,
      },
    });
  } catch (error) {
    apiCatch(req, res, error);
  }
}

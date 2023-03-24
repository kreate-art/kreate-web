import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import { KOLOURS_GENESIS_KREATION_POLICY_ID } from "@/modules/env/kolours/client";
import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import { getDeployedScriptUtxo } from "@/modules/next-backend/logic/getDeployedScript";
import { EnrichedUtxo } from "@/modules/next-backend/types";

export type TxParams$GenesisKreation$Response = {
  txParams: { gkNftRefScriptUtxo: EnrichedUtxo };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const gkNftRefScriptUtxo = await getDeployedScriptUtxo(db, {
      scriptHash: KOLOURS_GENESIS_KREATION_POLICY_ID,
    });
    assert(gkNftRefScriptUtxo, "Missing Genesis Kreation Ref UTxO");
    const result: TxParams$GenesisKreation$Response = {
      txParams: { gkNftRefScriptUtxo },
    };
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

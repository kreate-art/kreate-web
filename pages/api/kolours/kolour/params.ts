import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import { KOLOURS_KOLOUR_NFT_POLICY_ID } from "@/modules/env/kolours/client";
import { apiCatch } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";
import { getDeployedScriptUtxo } from "@/modules/next-backend/logic/getDeployedScript";
import { EnrichedUtxo } from "@/modules/next-backend/types";

export type TxParams$KolourNft$Response = {
  txParams: { kolourNftRefScriptUtxo: EnrichedUtxo };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const kolourNftRefScriptUtxo = await getDeployedScriptUtxo(db, {
      scriptHash: KOLOURS_KOLOUR_NFT_POLICY_ID,
    });
    assert(kolourNftRefScriptUtxo, "Missing Kolour NFT Ref UTxO");
    const result: TxParams$KolourNft$Response = {
      txParams: { kolourNftRefScriptUtxo },
    };
    sendJson(res.status(200), result);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

import { GenesisKreationQuotation } from "@kreate/protocol/schema/teiki/kolours";
import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
  KOLOURS_HMAC_SECRET,
} from "@/modules/env/kolours/server";
import { getExpirationTime } from "@/modules/kolours/common";
import { discountFromDb } from "@/modules/kolours/fees";
import { quoteGenesisKreation } from "@/modules/kolours/genesis-kreation";
import { lookupReferral } from "@/modules/kolours/referral";
import { GenesisKreationStatus } from "@/modules/kolours/types/Kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db, redis } from "@/modules/next-backend/connections";

type Response = {
  quotation: GenesisKreationQuotation;
  signature?: crypt.Base64;
  baseDiscount: number;
  status: GenesisKreationStatus;
};

export type QuoteGKNft$Response = Response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assert(
      KOLOURS_HMAC_SECRET && KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
      "genesis kreation disabled"
    );

    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });
    const { id, address } = req.query;

    ClientError.assert(id && typeof id === "string", {
      _debug: "invalid id",
    });

    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });

    const referral = await lookupReferral(redis, db, address);

    const quoted = await quoteGenesisKreation(db, id, referral?.discount);
    ClientError.assert(quoted, { _debug: "unknown genesis kreation" });

    const {
      imageCid,
      fee,
      listedFee,
      status,
      baseDiscount: str_baseDiscount,
    } = quoted;
    const baseDiscount = discountFromDb(str_baseDiscount);

    const quotation: GenesisKreationQuotation = {
      id,
      image: `ipfs://${imageCid}`,
      fee,
      listedFee,
      baseDiscount,
      userAddress: address,
      feeAddress: KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
      referral: referral ?? undefined,
      expiration: getExpirationTime(),
    };
    const signature =
      status === "ready"
        ? crypt.hmacSign(512, KOLOURS_HMAC_SECRET, {
            json: { genesis_kreation: quotation },
          })
        : undefined;
    const ret: Response = { quotation, signature, baseDiscount, status };
    sendJson(res, ret);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

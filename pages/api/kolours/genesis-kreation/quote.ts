import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
  KOLOURS_HMAC_SECRET,
} from "@/modules/env/kolours/server";
import {
  calculateDiscountedFee,
  ExtraParams,
  fetchDiscount,
  getExpirationTime,
  lookupReferral,
} from "@/modules/kolours/common";
import {
  GenesisKreationQuotation,
  GenesisKreationStatus,
  quoteGenesisKreation,
} from "@/modules/kolours/genesis-kreation";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db } from "@/modules/next-backend/connections";

type Response = {
  quotation: GenesisKreationQuotation;
  signature?: crypt.Base64;
  status: GenesisKreationStatus;
};

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
    const { id, referral: r_referral, address } = req.query;

    ClientError.assert(id && typeof id === "string", {
      _debug: "invalid id",
    });

    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });

    ClientError.assert(!r_referral || typeof r_referral === "string", {
      _debug: "invalid referral",
    });
    const referral = lookupReferral(address);

    const extra: ExtraParams = { referral };
    const discount = referral ? await fetchDiscount(db, referral) : undefined;

    const quoted = await quoteGenesisKreation(db, id);
    ClientError.assert(quoted, { _debug: "unknown genesis kreation" });

    const { imageCid, listedFee, status } = quoted;
    const fee = calculateDiscountedFee(listedFee, discount);

    const quotation: GenesisKreationQuotation = {
      id,
      image: `ipfs://${imageCid}`,
      fee,
      listedFee,
      userAddress: address,
      feeAddress: KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
      ...extra,
      expiration: getExpirationTime(),
    };
    const signature =
      status === "ready"
        ? crypt.hmacSign(512, KOLOURS_HMAC_SECRET, {
            json: quotation,
          })
        : undefined;
    const ret: Response = { quotation, signature, status };
    sendJson(res, ret);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

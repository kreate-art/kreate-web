import { randomUUID } from "crypto";

import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_HMAC_SECRET,
  KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
} from "@/modules/env/kolours/server";
import {
  calculateDiscountedFee,
  ExtraParams,
  fetchDiscount,
  getExpirationTime,
  Kolour,
  parseKolour,
  parseReferral,
} from "@/modules/kolours/common";
import {
  calculateGenesisKreationFee,
  GenesisKreationQuotation,
} from "@/modules/kolours/genesis-kreation";
import {
  calculateKolourFee,
  createKolourImage,
  getUnavailableKolours,
  KolourEntry,
  KolourQuotation,
  KOLOUR_IMAGE_CID_PREFIX,
  KOLOUR_IMAGE_LOCK_PREFIX,
} from "@/modules/kolours/kolour";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db, ipfs, redis } from "@/modules/next-backend/connections";
import locking from "@/modules/next-backend/locking";

type Response = {
  quotation: GenesisKreationQuotation;
  signature: crypt.Base64;
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
    const referral = parseReferral(r_referral);

    // TODO: Check availability + load information...

    const extra: ExtraParams = { referral };
    const discount = referral ? await fetchDiscount(db, referral) : undefined;

    const listedFee = calculateGenesisKreationFee(id);
    const fee = calculateDiscountedFee(listedFee, discount);

    const quotation: GenesisKreationQuotation = {
      id,
      metadata: {
        name: "Dummy Name",
        description: "Dummy Description",
        image: "ipfs://dummy-ipfs",
      },
      fee,
      listedFee,
      userAddress: address,
      feeAddress: KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
      expiration: getExpirationTime(),
      ...extra,
    };
    const signature = crypt.hmacSign(512, KOLOURS_HMAC_SECRET, {
      json: quotation,
    });
    const ret: Response = { quotation, signature };
    sendJson(res, ret);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

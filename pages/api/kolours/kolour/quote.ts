import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_HMAC_SECRET,
  KOLOURS_KOLOUR_NFT_FEE_ADDRESS,
} from "@/modules/env/kolours/server";
import { getExpirationTime, parseKolour } from "@/modules/kolours/common";
import { calculateKolourFee, computeFee } from "@/modules/kolours/fees";
import {
  checkFreeMintAvailability,
  generateKolourImageCid,
  getGenesisKreationWithKolours,
} from "@/modules/kolours/kolour";
import { lookupReferral } from "@/modules/kolours/referral";
import {
  DISCOUNT_MULTIPLIER,
  Kolour,
  KolourEntry,
  KolourQuotation,
  KolourQuotationProgram,
  KolourQuotationSource,
} from "@/modules/kolours/types/Kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db, ipfs, redis } from "@/modules/next-backend/connections";

type Response = {
  quotation: KolourQuotation;
  signature: crypt.Base64;
  unavailable?: Kolour[];
};

export type QuoteKolourNft$Response = Response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assert(
      KOLOURS_HMAC_SECRET && KOLOURS_KOLOUR_NFT_FEE_ADDRESS,
      "kolour nft disabled"
    );

    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });

    const { kolour: r_kolour, address } = req.query;
    const source = extractKolourSource(req);

    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });

    const r_kolours = r_kolour
      ? typeof r_kolour === "string"
        ? r_kolour.split(",")
        : r_kolour
      : [];
    const kolours = Array.from(
      new Set(
        r_kolours.map((term) => {
          const kolour = parseKolour(term.trim());
          ClientError.assert(kolour, { _debug: `invalid kolour: ${term}` });
          return kolour;
        })
      )
    );
    ClientError.assert(kolours.length, { _debug: "kolour is required" });

    let program: KolourQuotationProgram, baseDiscount: number;
    switch (source.type) {
      case "free":
        await checkFreeMintAvailability(db, address, kolours);
        program = { source };
        baseDiscount = DISCOUNT_MULTIPLIER; // 100%
        break;
      case "genesis_kreation": {
        // TODO: Fetch base_discount from kreation
        const kreation = req.query.kreation;
        ClientError.assert(kreation && typeof kreation === "string", {
          _debug: "invalid kreation id",
        });
        const [referral, kreationInfo] = await Promise.all([
          lookupReferral(redis, db, address),
          getGenesisKreationWithKolours(db, kreation, kolours),
        ]);
        ClientError.assert(kreationInfo, {
          _debug: "unknown kreation",
        });
        ClientError.assert(kreationInfo.available === kolours.length, {
          _debug: "kolours are unavailable",
        });
        program = { source, referral: referral ?? undefined };
        baseDiscount = kreationInfo.baseDiscount;
        break;
      }
      case "present":
        // TODO: Support `present` later.
        throw new ClientError({ _debug: "present source is unsupported" });
    }

    const referralDiscount = program?.referral?.discount;
    const quotation: KolourQuotation = {
      ...program,
      kolours: Object.fromEntries(
        await Promise.all(
          kolours.map(async (kolour) => [
            kolour,
            await quoteKolour(kolour, baseDiscount, referralDiscount),
          ])
        )
      ),
      userAddress: address,
      feeAddress: KOLOURS_KOLOUR_NFT_FEE_ADDRESS,
      expiration: getExpirationTime(),
    };
    const signature = crypt.hmacSign(512, KOLOURS_HMAC_SECRET, {
      json: { kolour: quotation },
    });
    sendJson(res, { quotation, signature } satisfies Response);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

async function quoteKolour(
  kolour: Kolour,
  baseDiscount: number,
  referralDiscount?: number
): Promise<KolourEntry> {
  const listedFee = calculateKolourFee(kolour);
  const cid = await generateKolourImageCid(redis, ipfs, kolour);
  return {
    listedFee,
    fee: computeFee(listedFee, baseDiscount, referralDiscount),
    image: `ipfs://${cid}`,
  };
}

function extractKolourSource(req: NextApiRequest): KolourQuotationSource {
  const sourceType = req.query.source;
  ClientError.assert(
    typeof sourceType === "string" &&
      (sourceType === "present" ||
        sourceType === "free" ||
        sourceType === "genesis_kreation"),
    { _debug: "invalid source" }
  );
  switch (sourceType) {
    case "genesis_kreation": {
      const kreation = req.query.kreation;
      ClientError.assert(kreation && typeof kreation === "string", {
        _debug: "invalid kreation",
      });
      return { type: "genesis_kreation", kreation };
    }
    default:
      return { type: sourceType };
  }
}

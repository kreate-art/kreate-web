import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_HMAC_SECRET,
  KOLOURS_KOLOUR_NFT_FEE_ADDRESS,
} from "@/modules/env/kolours/server";
import { getExpirationTime, parseKolour } from "@/modules/kolours/common";
import { calculateKolourFee, computeFees } from "@/modules/kolours/fees";
import {
  areKoloursAvailable,
  generateKolourImageCid,
  validateFreeMintAvailability,
} from "@/modules/kolours/kolour";
import { lookupReferral } from "@/modules/kolours/referral";
import {
  FREE_MINT_REFERRAL,
  Kolour,
  KolourEntry,
  KolourQuotation,
  KolourQuotationProgramme,
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

    const { kolour: r_kolour, address, source: r_source } = req.query;

    ClientError.assert(
      r_source == null ||
        (typeof r_source === "string" &&
          (r_source === "free" || r_source === "genesis-kreation")),
      { _debug: "invalid source" }
    );
    const source = r_source || "genesis-kreation"; // TODO: Support later

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

    let programme: KolourQuotationProgramme;
    switch (source) {
      case "free":
        await validateFreeMintAvailability(db, address, kolours);
        programme = { source, referral: FREE_MINT_REFERRAL };
        break;
      case "genesis-kreation": {
        const [referral, areAvailable] = await Promise.all([
          lookupReferral(redis, db, address),
          areKoloursAvailable(db, kolours),
        ]);
        ClientError.assert(areAvailable, {
          _debug: "kolours are unavailable",
        });
        programme = { source, referral: referral ?? undefined };
        break;
      }
    }

    const discount = programme.referral?.discount;
    const quotation: KolourQuotation = {
      ...programme,
      kolours: Object.fromEntries(
        await Promise.all(
          kolours.map(async (k) => [k, await quoteKolour(k, discount)])
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
  discount?: number
): Promise<KolourEntry> {
  const baseFee = calculateKolourFee(kolour);
  const cid = await generateKolourImageCid(redis, ipfs, kolour);
  return { ...computeFees(baseFee, discount), image: `ipfs://${cid}` };
}

import { randomUUID } from "crypto";

import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_FEE_ADDRESS,
  KOLOURS_HMAC_SECRET,
} from "@/modules/env/kolours/server";
import {
  calculateKolourFee,
  ExtraParams,
  getDiscount,
  getUnavailableKolours,
  Kolour,
  KolourEntry,
  KolourQuotation,
  KOLOUR_IMAGE_CID_PREFIX,
  KOLOUR_IMAGE_LOCK_PREFIX,
  parseKolour,
  parseReferral,
} from "@/modules/kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db, ipfs, redis } from "@/modules/next-backend/connections";
import locking from "@/modules/next-backend/locking";

const IMAGE_OPTIONS: Omit<sharp.Create, "background"> = {
  width: 128,
  height: 128,
  channels: 3,
};

type Response = {
  quotation: KolourQuotation;
  signature: crypt.Base64;
  unavailable?: Kolour[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assert(KOLOURS_HMAC_SECRET && KOLOURS_FEE_ADDRESS, "kolours disabled");

    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });
    const { kolour: r_kolour, referral: r_referral, address } = req.query;

    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });

    ClientError.assert(!r_referral || typeof r_referral === "string", {
      _debug: "invalid referral",
    });
    const referral = parseReferral(r_referral);

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

    const unavailable = await getUnavailableKolours(db, kolours);
    const available = kolours.filter((k) => !unavailable.has(k));
    ClientError.assert(available.length, {
      _debug: "all selected kolours are unavailable",
    });

    const extra: ExtraParams = { referral };
    const discount = referral ? await getDiscount(db, referral) : undefined;

    const quotation: KolourQuotation = {
      kolours: Object.fromEntries(
        await Promise.all(
          available.map(async (kolour) => [
            kolour,
            await quoteKolour(kolour, discount),
          ])
        )
      ),
      userAddress: address,
      feeAddress: KOLOURS_FEE_ADDRESS,
      expiration: getExpirationTime(),
      ...extra,
    };
    const signature = crypt.hmacSign(512, KOLOURS_HMAC_SECRET, {
      json: quotation,
    });
    const ret: Response = {
      quotation,
      signature,
      unavailable: unavailable.size ? Array.from(unavailable) : undefined,
    };
    sendJson(res, ret);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

async function quoteKolour(
  kolour: Kolour,
  discount?: bigint
): Promise<KolourEntry> {
  const fees = calculateKolourFee(kolour, discount);
  const cid = await generateKolourImageCid(kolour);
  return { ...fees, image: `ipfs://${cid}` };
}

async function generateKolourImageCid(kolour: Kolour) {
  const cidKey = KOLOUR_IMAGE_CID_PREFIX + kolour;
  let cachedCid = await redis.get(cidKey);
  if (cachedCid) return cachedCid;

  const imageLockKey = KOLOUR_IMAGE_LOCK_PREFIX + kolour;
  const imageLock = await locking.acquire(imageLockKey, randomUUID(), {
    ttl: 5,
  });
  try {
    // Fetch again, just in case the image was already processed, better use WATCH
    cachedCid = await redis.get(cidKey);
    if (cachedCid) return cachedCid;
    const image = await sharp({
      create: { ...IMAGE_OPTIONS, background: `#${kolour}` },
    })
      .png({ colors: 2 })
      .toBuffer();
    const { cid } = await ipfs.add(image, { pin: true });
    const cidStr = cid.toString();
    await redis.set(cidKey, cidStr, "EX", 86400); // 1 day
    return cidStr;
  } finally {
    imageLock.release();
  }
}

function getExpirationTime(): number {
  let unixSecs = Math.trunc(Date.now() / 1000);
  // Less signature leak
  unixSecs -= unixSecs % 60;
  return unixSecs + 6666666;
}

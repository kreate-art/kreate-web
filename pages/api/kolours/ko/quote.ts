import { Address } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import * as Uuid from "uuid";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_FEE_ADDRESS,
  KOLOURS_HMAC_SECRET,
} from "@/modules/env/kolours/server";
import {
  areKoloursAvailable,
  calculateKolourFee,
  ExtraParams,
  Kolour,
  KolourListing,
  KO_IMAGE_CID_PREFIX,
  KO_IMAGE_LOCK_PREFIX,
  parseKolour,
  Quotation,
} from "@/modules/kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { ipfs, redis } from "@/modules/next-backend/connections";
import locking from "@/modules/next-backend/locking";

const IMAGE_OPTIONS: Omit<sharp.Create, "background"> = {
  width: 128,
  height: 128,
  channels: 3,
};

type Response = {
  quotation: Quotation;
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
    const { kolour: r_kolour, address, referral } = req.query;

    ClientError.assert(address && typeof address === "string", {
      _debug: "invalid address",
    });
    ClientError.assert(!referral || typeof referral === "string", {
      _debug: "invalid referral",
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

    const status = await areKoloursAvailable(kolours);
    const available = kolours.filter((k) => status[k]);
    const unavailable = kolours.filter((k) => !status[k]);

    ClientError.assert(available.length, {
      _debug: "all selected kolours are unavailable",
    });

    const extra: ExtraParams = { referral };

    const quotation: Quotation = {
      kolours: Object.fromEntries(
        await Promise.all(
          available.map(async (kolour) => [
            kolour,
            await quoteKolour(kolour, address, extra),
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
      unavailable: unavailable.length ? unavailable : undefined,
    };
    sendJson(res, ret);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

async function quoteKolour(
  kolour: Kolour,
  address: Address,
  extra: ExtraParams
): Promise<KolourListing> {
  const fee = calculateKolourFee(kolour, address, extra);
  const cid = await generateKolourImageCid(kolour);
  return { fee, image: `ipfs://${cid}` };
}

async function generateKolourImageCid(kolour: Kolour) {
  const cidKey = KO_IMAGE_CID_PREFIX + kolour;
  let cachedCid = await redis.get(cidKey);
  if (cachedCid) return cachedCid;

  const imageLockKey = KO_IMAGE_LOCK_PREFIX + kolour;
  const imageLock = await locking.acquire(imageLockKey, Uuid.v4(), { ttl: 5 });
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
    await redis.set(cidKey, cidStr);
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

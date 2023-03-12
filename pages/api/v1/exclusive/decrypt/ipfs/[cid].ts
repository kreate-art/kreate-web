import stream from "node:stream";

import { fileTypeStream } from "file-type";
import { NextApiRequest, NextApiResponse } from "next";

import {
  TEIKI_CONTENT_KEYS,
  TEIKI_HMAC_SECRET,
} from "../../../../../../config/server";

import * as crypt from "@/modules/crypt";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { ipfs } from "@/modules/next-backend/connections";

// TODO: Remove this route later

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });
    const { cid, kid, iv, aut, exp: r_exp, sig } = req.query;

    ClientError.assert(
      isNonEmptyString(cid) &&
        isNonEmptyString(kid) &&
        isNonEmptyString(iv) &&
        isNonEmptyString(aut) &&
        isNonEmptyString(r_exp) &&
        /^[0-9]+$/.test(r_exp),
      { _debug: "invalid request" }
    );

    const exp = Number(r_exp);
    ClientError.assert(Date.now() <= exp * 1000, {
      _debug: "expired",
    });

    const payload = { json: { cid, kid, iv, aut, exp } };
    ClientError.assert(sig === crypt.hmacSign(TEIKI_HMAC_SECRET, payload), {
      _debug: "invalid signature",
    });

    const { key } = crypt.selectKey(TEIKI_CONTENT_KEYS, kid);
    const b_iv = Buffer.from(iv, crypt.b64);
    const b_aut = Buffer.from(aut, crypt.b64);
    const decipher = crypt.createDecipher(key, b_iv);
    decipher.setAuthTag(b_aut);

    const upstream = stream.Readable.from(ipfs.cat(`/ipfs/${cid}`));
    upstream.on("error", (error) => apiCatch(req, res, error));

    const upstreamWithFt = await fileTypeStream(upstream.pipe(decipher));
    res.setHeader("Etag", `"${cid}"`);
    res.setHeader(
      "Cache-Control",
      "private, max-age=3600, must-revalidate, immutable"
    );
    res.setHeader(
      "Content-Type",
      upstreamWithFt.fileType?.mime ?? "application/octet-stream"
    );
    await stream.promises.pipeline(upstreamWithFt, res);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

function isNonEmptyString(value: unknown): value is string {
  return !!value && typeof value === "string";
}

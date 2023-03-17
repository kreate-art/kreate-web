import stream from "node:stream";

import { fileTypeStream } from "file-type";
import { NextApiRequest, NextApiResponse } from "next";

import * as crypt from "@/modules/crypt";
import { KREATE_CONTENT_KEYS, KREATE_HMAC_SECRET } from "@/modules/env/server";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { ipfs } from "@/modules/next-backend/connections";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "GET", {
      _debug: "invalid http method",
    });
    const { cid, kid, iv, tag, aad, exp: r_exp, sig } = req.query;

    ClientError.assert(
      isNonEmptyString(cid) &&
        isNonEmptyString(kid) &&
        isNonEmptyString(iv) &&
        isNonEmptyString(tag) &&
        (!aad || typeof aad === "string") &&
        isNonEmptyString(r_exp) &&
        /^[0-9]+$/.test(r_exp),
      { _debug: "invalid request" }
    );

    const exp = Number(r_exp);
    ClientError.assert(Date.now() <= exp * 1000, {
      _debug: "expired",
    });

    const payload = { json: { cid, kid, iv, tag, aad, exp } };
    ClientError.assert(sig === crypt.hmacSign(KREATE_HMAC_SECRET, payload), {
      _debug: "invalid signature",
    });

    const { key } = crypt.selectKey(KREATE_CONTENT_KEYS, kid);
    const decipher = crypt.createDecipher(key, Buffer.from(iv, crypt.b64));
    decipher.setAuthTag(Buffer.from(tag, crypt.b64));
    aad && decipher.setAAD(Buffer.from(aad, crypt.b64));

    res.setHeader("Accept-Ranges", "none");
    res.setHeader("Etag", `"${cid}"`);
    res.setHeader(
      "Cache-Control",
      "private, max-age=3600, must-revalidate, immutable"
    );

    const upstream = stream.Readable.from(
      ipfs.cat(`/ipfs/${cid}`, { timeout: 10_000 })
    );
    upstream.on("error", (error) => apiCatch(req, res, error));

    const upstreamWithFt = await fileTypeStream(upstream.pipe(decipher));
    res.setHeader(
      "Content-Type",
      upstreamWithFt.fileType?.mime ?? "application/octet-stream"
    );

    await stream.promises.pipeline(upstreamWithFt, res);
    res.status(200);
  } catch (error) {
    if (
      error instanceof Error &&
      req.headers.range &&
      // We will support proper streaming later...
      error.message.includes("Unsupported state or unable to authenticate data")
    ) {
      console.error("...");
      return res.status(200);
    }
    apiCatch(req, res, error);
  }
}

function isNonEmptyString(value: unknown): value is string {
  return !!value && typeof value === "string";
}

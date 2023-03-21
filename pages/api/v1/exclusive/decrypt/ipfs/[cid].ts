import stream from "node:stream";

import { fileTypeStream } from "file-type";
import { NextApiRequest, NextApiResponse } from "next";

import { noop } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KREATE_CONTENT_KEYS,
  KREATE_CONTENT_HMAC_SECRET,
} from "@/modules/env/server";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { ipfs } from "@/modules/next-backend/connections";

export const config = {
  api: {
    responseLimit: false,
  },
};

const IPFS_TIMEOUT = 10_000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new AbortController();
  const signal = controller.signal;

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
    ClientError.assert(
      sig === crypt.hmacSign(KREATE_CONTENT_HMAC_SECRET, payload),
      {
        _debug: "invalid signature",
      }
    );

    const { key } = crypt.selectKey(KREATE_CONTENT_KEYS, kid);
    const decipher = crypt.createDecipher(key, Buffer.from(iv, crypt.b64), {
      signal,
    });
    decipher.setAuthTag(Buffer.from(tag, crypt.b64));
    aad && decipher.setAAD(Buffer.from(aad, crypt.b64));

    // AES-GCM has a nice attribute: len(ciphertext) == len(plaintext)
    const { size } = await ipfs.files.stat(`/ipfs/${cid}`, {
      timeout: IPFS_TIMEOUT,
      signal,
    });

    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Etag", `"${cid}"`);
    res.setHeader(
      "Cache-Control",
      "private, max-age=3600, must-revalidate, immutable"
    );

    const rangeHeader = req.headers.range;
    if (rangeHeader) {
      const { start, end } = parseRange(size, rangeHeader);
      if (start < 0 || end < start || end >= size) {
        res.setHeader("Content-Range", `bytes */${size}`);
        throw new ClientError({ _debug: "out of range" }, 426);
      }
      const u = await fetchIpfsUpstream(cid, decipher, signal, end + 1);
      res.setHeader("Content-Length", end - start + 1);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
      res.setHeader("Content-Type", u.contentType);
      res.status(206);
      const slice = sliceTransform(start, end, { signal });
      await stream.promises.pipeline(u.upstream, slice, res, { signal });
    } else {
      const u = await fetchIpfsUpstream(cid, decipher, signal);
      res.setHeader("Content-Length", size);
      res.setHeader("Content-Type", u.contentType);
      res.status(200);
      await stream.promises.pipeline(u.upstream, res, { signal });
    }
  } catch (error) {
    const code =
      error instanceof Error
        ? (error as NodeJS.ErrnoException).code
        : undefined;
    // Client can end requests prematurely. And our sliceTransform needs it too.
    if (code === "ERR_STREAM_PREMATURE_CLOSE") return;
    // Range requests makes authentication tag useless afterall...
    if (
      req.headers.range &&
      error instanceof Error &&
      error.message.includes("Unsupported state or unable to authenticate data")
    )
      return;
    if (code === "ABORT_ERR") {
      console.log(error);
      const cause = (error as Error).cause ?? error;
      apiCatch(req, res, cause);
    } else {
      apiCatch(req, res, error);
      controller.abort(error);
    }
  } finally {
    res.end();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return !!value && typeof value === "string";
}

async function fetchIpfsUpstream(
  cid: string,
  decipher: stream.Transform,
  signal: AbortSignal,
  length?: number
) {
  // Because of of encryption, we cannot seek upstream based on requested Range
  // However, I still limit the `length`, just in case we mess up something.
  const ipfsStream = stream.Readable.from(
    ipfs.cat(`/ipfs/${cid}`, { timeout: IPFS_TIMEOUT, signal, length })
  );
  const upstream = await fileTypeStream(
    stream.pipeline(ipfsStream, decipher, noop)
  );
  const contentType = upstream.fileType?.mime ?? "application/octet-stream";
  return { upstream, contentType };
}

function parseRange(
  size: number,
  header: string,
  fallbackLength = 10 * 1024 * 1024 // 10MB
): { start: number; end: number } {
  const [unit, allRanges] = header.split("=", 2);
  ClientError.assert(unit === "bytes", { _debug: "only accept bytes range" });
  ClientError.assert(allRanges, { _debug: "no range specified" });
  const [range, _rest] = allRanges.split(",", 2);
  ClientError.assert(!_rest, { _debug: "only accept a single range" });
  const [startStr, endStr] = range.trim().split("-");
  if (startStr) {
    const start = parseInt(startStr);
    ClientError.assert(!isNaN(start), { _debug: "invalid range start" });
    if (endStr) {
      const end = parseInt(endStr);
      ClientError.assert(!isNaN(end), { _debug: "invalid range end" });
      return { start, end };
    } else return { start, end: Math.min(size, start + fallbackLength) - 1 };
  } else if (endStr) {
    const suffix = parseInt(endStr);
    ClientError.assert(!isNaN(suffix), { _debug: "invalid range suffix" });
    return { start: size - suffix, end: size - 1 };
  } else throw new ClientError({ _debug: "invalid range" });
}

// Inspired from: https://deno.land/std@0.180.0/streams/byte_slice_stream.ts?source
function sliceTransform(
  start: number,
  end: number,
  options?: stream.TransformOptions
): stream.Transform {
  // [start, end]
  end += 1;
  let offsetStart: number, offsetEnd: number;
  let finished: boolean;
  return new stream.Transform({
    construct(callback) {
      offsetStart = offsetEnd = 0;
      finished = false;
      callback();
    },
    transform(chunk: Buffer, _encoding, callback) {
      if (finished) {
        // This is a trick to make sure the single downstream finishes handling
        // everything before ending the transform stream.
        return this.destroy();
      }
      offsetStart = offsetEnd;
      offsetEnd += chunk.byteLength;
      if (offsetEnd > start) {
        if (offsetStart < start) chunk = chunk.subarray(start - offsetStart);
        if (offsetEnd >= end) {
          chunk = chunk.subarray(0, chunk.byteLength - offsetEnd + end);
          callback(null, chunk);
          finished = true;
        } else {
          callback(null, chunk);
        }
      } else {
        callback();
      }
    },
    ...options,
  });
}

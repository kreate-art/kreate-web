import stream from "node:stream";

import { NextApiRequest, NextApiResponse } from "next";

import { noop } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import { HOST } from "@/modules/env/client";
import {
  KREATE_CONTENT_DEFAULT_KEY_ID,
  KREATE_CONTENT_KEYS,
} from "@/modules/env/server";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { PinResult, pinToIpfs } from "@/modules/next-backend/logic/postIpfsPin";
import { signIpfsUrl } from "@/modules/next-backend/utils/CodecCidCipher";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

type Envelope = crypt.CipherMeta & PinResult & { preview: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "POST", {
      _debug: "invalid http method",
    });

    const { kid, key } = crypt.selectKey(
      KREATE_CONTENT_KEYS,
      KREATE_CONTENT_DEFAULT_KEY_ID
    );
    const iv = crypt.randomIv();
    const cipher = crypt.createCipher(key, iv);

    const pinned = await pinToIpfs(req, (file) =>
      stream.pipeline(file, cipher, noop)
    );

    const meta: Omit<crypt.CipherMeta, "enc"> = {
      kid,
      iv: iv.toString(crypt.b64),
      tag: cipher.getAuthTag().toString(crypt.b64),
    };

    const preview =
      HOST +
      "/api/v1/exclusive/decrypt/ipfs/" +
      pinned.cid +
      "?" +
      new URLSearchParams({ ...meta, ...signIpfsUrl(pinned.cid, meta) });

    const ev: Envelope = {
      enc: "proto",
      ...meta,
      ...pinned,
      preview,
    };
    sendJson(res.status(200), ev);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

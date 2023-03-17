import { NextApiRequest, NextApiResponse } from "next";

import * as crypt from "@/modules/crypt";
import {
  KREATE_CONTENT_DEFAULT_KEY_ID,
  KREATE_CONTENT_KEYS,
} from "@/modules/env/server";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

type Envelope = crypt.CipherMeta & { ciphertext: crypt.Base64 };

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

    const chunks: Uint8Array[] = [];
    for await (const chunk of req.pipe(cipher)) chunks.push(chunk);
    const ciphertext = Buffer.concat(chunks).toString(crypt.b64);

    const meta: crypt.CipherMeta = {
      enc: "proto",
      kid,
      iv: iv.toString(crypt.b64),
      tag: cipher.getAuthTag().toString(crypt.b64),
    };

    const ev: Envelope = { ...meta, ciphertext };

    sendJson(res.status(200), ev);
  } catch (error) {
    apiCatch(req, res, error);
  }
}

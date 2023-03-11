import crypto from "node:crypto";
import stream from "node:stream";

import { toJsonStable, ValidJsonTypes } from "../json-utils";

import { assert } from "@/modules/common-utils";

export type Base64 = string;
export const Base64 = "base64url";

type BinaryLike = string | NodeJS.ArrayBufferView;
type CipherOptions = stream.TransformOptions & {
  authTagLength?: number | undefined;
};

export type KeyType = "content" | "hmac";
export type KeyId = string;
export type KeyObject = crypto.KeyObject;
export type KeySet = Map<KeyId, KeyObject>;

const ENC_ALGO = "aes-128-gcm" as const;
const ENC_IV_LEN = 16 as const;
const HMAC_ALGO = "sha256" as const;

// TODO: Update format later...
export type CipherMeta = {
  enc: "proto";
  kid: string;
  iv: Base64;
  // Because GCM
  aut: Base64;
  // TODO: Make use of AAD also...
};

// Throw errors if key is not specified
export function selectKey(
  keySet: KeySet,
  kid: KeyId | undefined
): { kid: KeyId; key: crypto.KeyObject } {
  assert(kid, "selectKey: key id must be specified");
  const key = keySet.get(kid);
  assert(key, `selectKey: key '${kid}' is not defined`);
  return { kid, key };
}

export function createSecretKey(
  keyType: KeyType,
  key: string
): crypto.KeyObject {
  if (keyType === "content") {
    assert(
      /^[0-9a-f]{32}$/.test(key),
      "Content key must be a 32-char hex string"
    );
    return crypto.createSecretKey(key, "hex");
  } else {
    assert(/^\w{32,}$/.test(key), "HMAC key must be at least 32-char");
    return crypto.createSecretKey(key, "utf8");
  }
}

export function createCipher(
  key: crypto.KeyObject,
  iv: BinaryLike,
  options?: CipherOptions
) {
  return crypto.createCipheriv(ENC_ALGO, key, iv, options);
}

export function createDecipher(
  key: crypto.KeyObject,
  iv: BinaryLike,
  options?: CipherOptions
) {
  return crypto.createDecipheriv(ENC_ALGO, key, iv, options);
}

export function createHmac(
  key: crypto.KeyObject,
  options?: stream.TransformOptions
) {
  return crypto.createHmac(HMAC_ALGO, key, options);
}

export function randomIv() {
  return crypto.randomBytes(ENC_IV_LEN);
}

export function hmacSign(
  key: KeyObject,
  data: BinaryLike | { json: ValidJsonTypes }
): Base64 {
  const hmac = createHmac(key);
  if (typeof data === "string") hmac.update(data, "utf8");
  else if ("json" in data)
    hmac.update(toJsonStable(data.json, undefined, 0), "utf8");
  else hmac.update(data);
  return hmac.digest(Base64);
}

import crypto from "node:crypto";
import stream from "node:stream";

import { toJsonStable, ValidJsonTypes } from "../json-utils";

import { b64, Base64, KeyId, KeyType } from "./types";

import { assert } from "@/modules/common-utils";

export * from "./types";

type BinaryLike = string | NodeJS.ArrayBufferView;

export type Key = crypto.KeyObject;
export type KeySet = Map<KeyId, Key>;

// We use AES-128 since it has performance and better key schedule than AES-256
const ENC_ALGO = "aes-128-gcm" as const;
// We only need 12 bytes (instead of 16) for GCM
const ENC_IV_LEN = 12 as const;

// Throw errors if key is not specified
export function selectKey(
  keySet: KeySet,
  kid: KeyId | undefined
): { kid: KeyId; key: Key } {
  assert(kid, "selectKey: key id must be specified");
  const key = keySet.get(kid);
  assert(key, `selectKey: key '${kid}' is not defined`);
  return { kid, key };
}

export function createSecretKey(keyType: KeyType, keyText: string): Key {
  // TOOD: Validate base64...
  const keyBuffer = Buffer.from(keyText, b64);
  if (keyType === "cipher") {
    assert(keyBuffer.length === 16, "Cipher key must be 16 bytes");
    return crypto.createSecretKey(keyBuffer);
  } else {
    assert(keyBuffer.length == 32, "HMAC key must be 32 bytes");
    return crypto.createSecretKey(keyBuffer);
  }
}

type CipherOptions = stream.TransformOptions & {
  authTagLength?: number | undefined;
};

export function createCipher(
  key: Key,
  iv: BinaryLike,
  options?: CipherOptions
) {
  return crypto.createCipheriv(ENC_ALGO, key, iv, options);
}

export function createDecipher(
  key: Key,
  iv: BinaryLike,
  options?: CipherOptions
) {
  return crypto.createDecipheriv(ENC_ALGO, key, iv, options);
}

export function createHmac(
  size: 256 | 512,
  key: Key,
  options?: stream.TransformOptions
) {
  return crypto.createHmac(`sha${size}`, key, options);
}

export function randomIv() {
  return crypto.randomBytes(ENC_IV_LEN);
}

export function hmacSign(
  size: 256 | 512,
  key: Key,
  data: BinaryLike | { json: ValidJsonTypes }
): Base64 {
  const hmac = createHmac(size, key);
  if (typeof data === "string") hmac.update(data, "utf8");
  else if ("json" in data)
    hmac.update(toJsonStable(data.json, undefined, 0), "utf8");
  else hmac.update(data);
  return hmac.digest(b64);
}

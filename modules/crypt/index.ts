import crypto from "node:crypto";
import stream from "node:stream";

import { toJsonStable, ValidJsonTypes } from "../json-utils";

import { Base64, KeyId, KeyType } from "./types";

import { assert } from "@/modules/common-utils";

export * from "./types";

export const b64 = "base64url";

type BinaryLike = string | NodeJS.ArrayBufferView;

export type Key = crypto.KeyObject;
export type KeySet = Map<KeyId, Key>;

const ENC_ALGO = "aes-128-gcm" as const;
const ENC_IV_LEN = 16 as const;
const HMAC_ALGO = "sha256" as const;

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
  if (keyType === "content") {
    assert(keyBuffer.length === 16, "Content key must be 16 bytes");
    return crypto.createSecretKey(keyBuffer);
  } else {
    assert(keyBuffer.length >= 32, "HMAC key must be at least 32 bytes");
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

export function createHmac(key: Key, options?: stream.TransformOptions) {
  return crypto.createHmac(HMAC_ALGO, key, options);
}

export function randomIv() {
  return crypto.randomBytes(ENC_IV_LEN);
}

export function hmacSign(
  key: Key,
  data: BinaryLike | { json: ValidJsonTypes }
): Base64 {
  const hmac = createHmac(key);
  if (typeof data === "string") hmac.update(data, "utf8");
  else if ("json" in data)
    hmac.update(toJsonStable(data.json, undefined, 0), "utf8");
  else hmac.update(data);
  return hmac.digest(b64);
}

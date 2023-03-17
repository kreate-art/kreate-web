// Cardano web token

import { Address, Lucid } from "lucid-cardano";

import base64url from "@/modules/base64url";
import { Base64 } from "@/modules/crypt/types";
import { NETWORK } from "@/modules/env/client";

const TTL = 60 * 86_400 * 1_000; // 60 days
export const VERSION = 0;

export type SavedAuthInfo = {
  version: number;
  expiration: number; // UnixTime / 1000
  token: {
    payload: Base64;
    key: Base64;
    signature: Base64;
  };
};

export type AuthHeader = {
  address: Address;
  header: string;
};

// Sign a message
export async function sign(lucid: Lucid): Promise<SavedAuthInfo> {
  const payload = {
    version: VERSION,
    message: "Login to Teiki",
    expiration: Math.trunc(Date.now() + TTL) / 1_000,
  };
  const payloadBytes = Buffer.from(
    JSON.stringify(payload, undefined, 4),
    "utf8"
  );
  const { key, signature } = await lucid
    .newMessage(await lucid.wallet.address(), payloadBytes.toString("hex"))
    .sign();
  return {
    version: payload.version,
    expiration: payload.expiration,
    token: {
      payload: base64url.encode(payloadBytes),
      signature: base64url.encode(Buffer.from(signature, "hex")),
      key: base64url.encode(Buffer.from(key, "hex")),
    },
  };
}

export function constructHeader({
  savedAuthInfo,
  address,
}: {
  savedAuthInfo: SavedAuthInfo;
  address: Address;
}) {
  const {
    token: { payload, key, signature },
  } = savedAuthInfo;
  return `Token ${address}.${payload}.${key}.${signature}`;
}

export function getStorageKey() {
  return `auth-token.${NETWORK}`;
}

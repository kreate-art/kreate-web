// Cardano web token

import { Address, fromText, Lucid, SignedMessage } from "lucid-cardano";

import { toJsonStable } from "../json-utils";

import base64url from "@/modules/base64url";
import { NETWORK } from "@/modules/env/client";

const TTL = 30 * 86_400 * 1_000; // 30 days
export const VERSION = 1;

export type AuthMessage = {
  version: number;
  expiration: number;
  message: string;
};

export type AuthToken = {
  signed: SignedMessage;
  payload: string;
};

export type AuthInfo = {
  address: Address;
  header: string;
};

// Sign a message
export async function sign(lucid: Lucid) {
  const authMessage: AuthMessage = {
    version: VERSION,
    expiration: toExpirationTime(Date.now() + TTL),
    message: "Login to Teiki",
  };
  const payload = toJsonStable(authMessage, undefined, 4);
  const signed = await lucid
    .newMessage(await lucid.wallet.address(), fromText(payload))
    .sign();
  return { signed, payload };
}

export function constructAuthHeader({
  token,
  address,
}: {
  token: AuthToken;
  address: Address;
}) {
  const payload = base64url.encode(token.payload);
  const signature = base64url.encode(
    JSON.stringify(token.signed, undefined, 0)
  );
  return `Token ${address}.${payload}.${signature}`;
}

export function toExpirationTime(date: number) {
  return Math.floor(date / 1_000);
}

export function getStorageKey() {
  return `auth-token.${NETWORK}`;
}

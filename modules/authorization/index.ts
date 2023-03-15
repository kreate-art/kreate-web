// Cardano web token

import { Address, Lucid, SignedMessage, fromText, toText } from "lucid-cardano";

import { toJsonStable } from "../json-utils";

import { NETWORK } from "@/modules/env/client";

const TTL = 30 * 86_400 * 1_000; // 30 days
export const VERSION = 1;

export type AuthMessage = {
  version: number;
  expiration: number;
  message: string;
};

export type AuthToken = {
  signedMessage: SignedMessage;
  payload: string;
};

// Sign a message
export async function sign(lucid: Lucid) {
  const authMessage: AuthMessage = {
    version: VERSION,
    expiration: toExpirationTime(Date.now() + TTL),
    message: "Login to Teiki",
  };
  const payload = fromText(toJsonStable(authMessage, undefined, 4));
  const signedMessage = await lucid
    .newMessage(await lucid.wallet.address(), payload)
    .sign();
  return {
    signedMessage,
    payload,
  };
}

export function constructHeader({
  token,
  address,
}: {
  token: AuthToken;
  address: Address;
}) {
  return new Headers({
    Authorization: `Token ${address}.${token.payload}.${encodeURI(
      JSON.stringify(token.signedMessage)
    )}
    `,
  });
}

export function toExpirationTime(date: number) {
  return Math.floor(date / 1_000);
}

export function getStorageKey() {
  return `auth-token.${NETWORK}`;
}

// Cardano web token

import { Address, Lucid, SignedMessage, fromText, toText } from "lucid-cardano";
import ms from "ms";
import { NextApiRequest } from "next";

import { toJsonStable } from "../json-utils";
import {
  CLIENT_AUTHORIZATION_ERROR_STATUS,
  ClientError,
} from "../next-backend/api/errors";
import { clear, load, save } from "../storage-v2";
import { pure } from "../with-bufs-as";

import { NETWORK } from "@/modules/env/client";

const TTL = ms("1m");
const VERSION = 1;

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
  const token = {
    signedMessage,
    payload,
  };

  save(getStorageKey(), pure(token));
}

// Verify the message
export async function verify({
  address,
  signedMessage,
  payload,
}: {
  address: Address;
  signedMessage: SignedMessage;
  payload: string;
}): Promise<boolean> {
  return (await Lucid.new()).verifyMessage(address, payload, signedMessage);
}

export async function refresh(lucid: Lucid) {
  try {
    const { version, expiration } = await loadPayload();
    if (expiration < toExpirationTime(Date.now()))
      throw new Error("Authored token expired");
    if (version !== VERSION) {
      clear(getStorageKey());
      throw new Error("Deprecated token");
    }
  } catch (err) {
    console.warn(err);
    sign(lucid);
  }
}

export async function loadPayload(): Promise<AuthMessage> {
  const payload = ((await load(getStorageKey())).data as AuthToken)?.payload;
  return JSON.parse(toText(payload));
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

export async function authorizeRequest(req: NextApiRequest) {
  const prefixError = "The authentication failed because of";
  const authHeader = req.headers["authorization"];
  ClientError.assert(
    authHeader,
    `${prefixError} missing 'Authorization' header`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );

  const [authScheme, authToken] = authHeader.split(" ", 2);
  ClientError.assert(
    authScheme === "Token",
    `${prefixError} incorrect authorization scheme`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );

  const [address, payload, msg] = authToken.split(".");
  const signedMessage: SignedMessage = JSON.parse(decodeURI(msg));
  const { expiration } = JSON.parse(toText(payload));
  ClientError.assert(
    expiration,
    `${prefixError} invalid payload - missing expiration`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );
  ClientError.assert(
    expiration > toExpirationTime(Date.now()),
    `${prefixError} token expired: ${expiration}`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );
  ClientError.assert(
    await verify({
      address,
      signedMessage,
      payload,
    }),
    `${prefixError} unverified message`
  );

  return address;
}

export function toExpirationTime(date: number) {
  return Math.floor(date / 1_000);
}

export function getStorageKey() {
  return `auth-token.${NETWORK}`;
}

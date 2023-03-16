import { Address, Lucid, SignedMessage } from "lucid-cardano";
import { NextApiRequest } from "next";

import { ClientError, CLIENT_AUTHORIZATION_ERROR_STATUS } from "../api/errors";

import { AuthHeader } from "@/modules/authorization";

export async function authorizeRequest(
  req: NextApiRequest
): Promise<AuthHeader | undefined> {
  const prefixError = "The authentication failed because of";
  const authHeader = req.headers["authorization"];
  if (!authHeader) return undefined;

  const [authScheme, authToken] = authHeader.split(" ", 2);
  ClientError.assert(
    authScheme === "Token",
    `${prefixError} incorrect authorization scheme`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );

  const [address, payloadB64, keyB64, signatureB64] = authToken.split(".");
  const signed: SignedMessage = {
    key: Buffer.from(keyB64, "base64url").toString("hex"),
    signature: Buffer.from(signatureB64, "base64url").toString("hex"),
  };
  const payloadBuf = Buffer.from(payloadB64, "base64url");
  const { expiration } = JSON.parse(payloadBuf.toString("utf8"));
  ClientError.assert(
    expiration,
    `${prefixError} invalid payload - missing expiration`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );
  ClientError.assert(
    expiration > Date.now() / 1000,
    `${prefixError} token expired: ${expiration}`,
    CLIENT_AUTHORIZATION_ERROR_STATUS
  );
  ClientError.assert(
    await verify({ address, signed, payload: payloadBuf.toString("hex") }),
    `${prefixError} unverified message`
  );
  return { address, header: authHeader };
}

// Verify the message
export async function verify({
  address,
  signed,
  payload,
}: {
  address: Address;
  signed: SignedMessage;
  payload: string;
}): Promise<boolean> {
  return (await Lucid.new()).verifyMessage(address, payload, signed);
}

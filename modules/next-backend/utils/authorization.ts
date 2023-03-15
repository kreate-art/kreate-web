import { Address, Lucid, SignedMessage, toText } from "lucid-cardano";
import { NextApiRequest } from "next";

import { ClientError, CLIENT_AUTHORIZATION_ERROR_STATUS } from "../api/errors";

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
    expiration > Math.floor(Date.now()),
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

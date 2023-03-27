import { IncomingMessage } from "node:http";
import querystring from "node:querystring";

import ContentType from "content-type";
import { NextApiResponse, SizeLimit } from "next";
import { ApiError } from "next/dist/server/api-utils";
import getRawBody from "raw-body";

import isNextError from "./errors";

import { fromJson, toJson } from "@/modules/json-utils";

export function sendJson<T>(res: NextApiResponse, jsonBody: T): void {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(toJson(jsonBody));
}

// Copied from next.js but switched to use our `fromJson` implementation.
export async function parseBody(
  req: IncomingMessage,
  limit: SizeLimit = "1mb"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  let contentType;
  try {
    contentType = ContentType.parse(
      req.headers["content-type"] || "text/plain"
    );
  } catch {
    contentType = ContentType.parse("text/plain");
  }
  const { type, parameters } = contentType;
  const encoding = parameters.charset || "utf-8";
  let buffer;
  try {
    buffer = await getRawBody(req, { encoding, limit });
  } catch (e) {
    if (isNextError(e) && e.type === "entity.too.large") {
      throw new ApiError(413, `Body exceeded ${limit} limit`);
    } else {
      throw new ApiError(400, "Invalid body");
    }
  }
  const body = buffer.toString();
  if (type === "application/json" || type === "application/ld+json") {
    return parseJson(body);
  } else if (type === "application/x-www-form-urlencoded") {
    return querystring.decode(body);
  } else {
    return body;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(str: string): any {
  // special-case empty json body, as it's a common client-side mistake
  if (!str) return {};
  try {
    return fromJson(str);
  } catch (e) {
    throw new ApiError(400, "Invalid JSON");
  }
}

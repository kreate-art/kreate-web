import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";

const PASSTHROUGH_HEADERS = [
  "age",
  "content-type",
  "date",
  "expires",
  "last-modified",
];

/**
 * @sk-kitsune: A simple proxy.
 *
 * Ideally, we should implement an edge function to reduce load
 * from our backend server.
 *
 * This route provides a temporary solution to:
 * https://app.asana.com/0/1203842063837585/1203842189638361
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    ClientError.assert(req.method === "GET", { message: "invalid method" });
    const { url } = req.query;
    ClientError.assert(typeof url === "string", {
      message: "url must be a string",
    });
    const response = await fetch(url);
    if (!response.body) {
      throw new Error("empty body");
    }
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (PASSTHROUGH_HEADERS.includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    await response.body.pipeTo(
      new WritableStream({
        write(chunk) {
          return new Promise((resolve, reject) => {
            const available = res.write(chunk, (error) => {
              if (error) reject();
            });
            if (!available) {
              res.once("drain", () => resolve());
            } else {
              resolve();
            }
          });
        },
        close() {
          return new Promise<void>((resolve) => {
            res.end();
            if (res.closed) {
              resolve();
            } else {
              res.once("close", () => resolve());
            }
          });
        },
      })
    );
  } catch (error) {
    apiCatch(req, res, error);
  }
}

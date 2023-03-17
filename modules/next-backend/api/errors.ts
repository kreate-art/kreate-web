import { NextApiRequest, NextApiResponse } from "next";

import { sendJson } from "./helpers";

import { toJson } from "@/modules/json-utils";

export class ClientError extends Error {
  reason: unknown;

  constructor(reason: unknown) {
    super(toJson(reason));
    this.reason = reason;
  }

  static assert(condition: unknown, reason: unknown): asserts condition {
    if (!condition) {
      throw new ClientError(reason);
    }
  }

  static try$<T>(computation: () => T, reason: (cause: unknown) => unknown): T {
    try {
      return computation();
    } catch (cause) {
      throw new ClientError(reason(cause));
    }
  }
}

export function apiCatch(
  req: NextApiRequest,
  res: NextApiResponse,
  error: unknown,
  clientErrorStatus?: number,
  serverErrorStatus?: number,
  serverErrorMessage?: string
) {
  if (error instanceof ClientError)
    catchClientError(req, res, error, clientErrorStatus);
  else catchServerError(req, res, error, serverErrorStatus, serverErrorMessage);
}

export function catchClientError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: ClientError,
  status = 400
) {
  // TODO: Maybe Sentry
  console.error("[Client]", req.method, req.url, error);
  res.status(status);
  res.headersSent || sendJson(res, error.reason);
}

export function catchServerError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: unknown,
  status = 500,
  message = "server error"
) {
  // TODO: Sentry
  console.error("[Server]", req.method, req.url, error);
  res.status(status);
  res.headersSent ||
    sendJson(res, {
      _debug: {
        message: message,
        reason: error instanceof Error ? error.message : toJson(error),
      },
    });
}

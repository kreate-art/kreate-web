import { NextApiRequest, NextApiResponse } from "next";

import { sendJson } from "./helpers";

import { toJson } from "@/modules/json-utils";

const DEFAULT_CLIENT_ERROR_STATUS = 400;
const DEFAULT_SERVER_ERROR_STATUS = 500;
export const CLIENT_AUTHORIZATION_ERROR_STATUS = 401;

export class ClientError extends Error {
  reason: unknown;
  status: number;

  constructor(reason: unknown, status = DEFAULT_CLIENT_ERROR_STATUS) {
    super(toJson(reason));
    this.reason = reason;
    this.status = status;
  }

  static assert(
    condition: unknown,
    reason: unknown,
    status?: number
  ): asserts condition {
    if (!condition) {
      throw new ClientError(reason, status);
    }
  }

  static try$<T>(
    computation: () => T,
    reason: (cause: unknown) => unknown,
    status?: number
  ): T {
    try {
      return computation();
    } catch (cause) {
      throw new ClientError(reason(cause), status);
    }
  }
}

export function apiCatch(
  req: NextApiRequest,
  res: NextApiResponse,
  error: unknown,
  server?: {
    status: number;
    message: string;
  }
) {
  if (error instanceof ClientError) catchClientError(req, res, error);
  else catchServerError(req, res, error, server?.status, server?.message);
}

function catchClientError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: ClientError
) {
  // TODO: Maybe Sentry
  console.error("[Client]", req.method, req.url, error);
  const status = error.status;
  if (res.headersSent)
    console.warn(`[!] Too late for error response [${status}]...`);
  else sendJson(res.status(status), error.reason);
}

function catchServerError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: unknown,
  status = DEFAULT_SERVER_ERROR_STATUS,
  message = "server error"
) {
  // TODO: Sentry
  console.error("[Server]", req.method, req.url, error);
  if (res.headersSent)
    console.warn(`[!] Too late for error response [${status}]...`);
  else
    sendJson(res.status(status), {
      _debug: {
        message: message,
        reason: error instanceof Error ? error.message : toJson(error),
      },
    });
}

// Copied from next.js `is-error`

// We allow some additional attached properties for Errors
export interface NextError extends Error {
  type?: string;
  page?: string;
  code?: string | number;
  cancelled?: boolean;
}

export default function isNextError(err: unknown): err is NextError {
  return (
    typeof err === "object" && err !== null && "name" in err && "message" in err
  );
}

import { NextApiResponse } from "next";

import { toJson } from "@/modules/json-utils";

export function sendJson<T>(res: NextApiResponse, jsonBody: T): void {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(toJson(jsonBody));
}

import { Address } from "lucid-cardano";

import { Sql } from "../db";

export type Params = { projectId: string; relevantAddress: Address };

type Response = { match: number | undefined };

/** @deprecated */
export async function getProjectMatch(
  _sql: Sql,
  _params: Params
): Promise<Response> {
  return { match: undefined };
}

import { Sql } from "../next-backend/db";

import { getProjectDetailsResponse } from "./responses";

// Given a project cid, return its details in
// WithBufsAs<Project, URL> format
// TODO: Highly likely that we won't use this function...
export async function getProjectDetailsFromCid(sql: Sql, cid: string) {
  //TODO: Check whether project still active
  const projectDetailsFromDb = await sql`
    SELECT contents
      FROM ipfs.project_info
      WHERE cid = ${cid}
      LIMIT 2
  `;
  if (projectDetailsFromDb.length) {
    if (projectDetailsFromDb.length > 1)
      console.warn("Why 1 CID has multiple contents???");
    return getProjectDetailsResponse(projectDetailsFromDb[0].contents);
  } else {
    return {
      ok: false,
      message: "Invalid CID input", // TODO: Better error message
    };
  }
}

import { Sql } from "../db";

import { Cid } from "@/modules/next-backend/utils/CodecCid";

export async function getLogos(
  sql: Sql,
  letter: string,
  seed: number, // [-1, 1]
  count = 3
): Promise<Cid[]> {
  const rows = await sql.begin(async (sql) => {
    await sql`SELECT setseed(${seed})`;
    return await sql<{ cid: Cid }[]>`
      SELECT
        a.cid
      FROM
        ai.logo a
      WHERE
        letter = ${letter.toUpperCase()}
        AND NOT EXISTS (
          SELECT
            FROM ipfs.logo_used u
            WHERE u.cid = a.cid
        )
      ORDER BY random()
      LIMIT ${count}
    `;
  });
  return rows.map((r) => r.cid);
}

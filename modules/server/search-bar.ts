import { Sql } from "../next-backend/db";

export async function getTopTags(sql: Sql) {
  // TODO: update this query (like removing one layer of SELECT)
  const results = await sql`
    SELECT
      s.tag
    FROM
      (
        SELECT
          tag,
          COUNT(*) amount
        FROM
          ipfs.project_info
          CROSS JOIN LATERAL UNNEST(tags) x(tag)
        GROUP BY
          tag
        ORDER BY
          amount DESC,
          tag
        LIMIT
          10
      ) AS s
  `;
  return {
    error: null,
    data: results,
  };
}

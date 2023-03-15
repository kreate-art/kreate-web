// https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#text
// https://nextjs.org/learn/seo/crawling-and-indexing/xml-sitemaps

import { GetServerSideProps } from "next";

import { NEXT_PUBLIC_HOST } from "../config/client";

import { db } from "@/modules/next-backend/connections";
import { getAllProjects } from "@/modules/next-backend/logic/getAllProjects";

export default function SiteMap() {
  return null;
}

async function getAllRelativePaths() {
  const results = ["/"];
  const { projects, hasMore } = await getAllProjects(db, {
    active: true,
    // If there are more than 5000 projects, we should break our sitemap
    // into multiple sitemaps.
    limit: 5000,
    offset: 0,
  });

  if (hasMore) {
    console.error(
      "There are more than 5000 projects. Please split our sitemap."
    );
  }

  for (const project of projects) {
    const customUrl = project.basics.customUrl;
    results.push(
      customUrl ? `/k/${customUrl}` : `/kreator-by-id/${project.id}`
    );
  }
  return results;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const relativePaths = await getAllRelativePaths();
  const absolutePaths = relativePaths.map((path) => NEXT_PUBLIC_HOST + path);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(absolutePaths.join("\n"));
  res.end();

  return { props: {} };
};

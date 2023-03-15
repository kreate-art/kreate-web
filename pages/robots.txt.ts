import { GetServerSideProps } from "next";

import { NEXT_PUBLIC_HOST } from "../config/client";

export default function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(
    `
User-agent: *
Allow: /k/
Allow: /kreator-by-id/
Disallow: /kreator-by-id/*/update$
Disallow: /kreator-by-id/*/preview$
Disallow: /c/
Disallow: /creator-by-id/
Disallow: /projects/
Disallow: /projects-by-id/
Disallow: /secret-playground/

Sitemap: ${NEXT_PUBLIC_HOST}/sitemap.txt
`.trimStart()
  );
  res.end();

  return { props: {} };
};

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
        {/* @sk-kitsune: we are removing Semantic UI gradually */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/stylesheets/semantic-modified.min.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-responsive-carousel/lib/styles/carousel.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import Head from "next/head";

import { HOST, KREATE_ENV } from "@/modules/env/client";

import {} from "../../../../config/client";

type Props = {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
};

export default function TeikiHead({
  title = "Teiki - Web3 membership platform",
  description = "Teiki is a Web3 membership platform providing Metaverse & AI tools for Creators to run a subscription service. Teiki helps creators earn an income every five days from members paying for exclusive benefits.",
  imageUrl = `${HOST}/images/meta-${
    KREATE_ENV === "mainnet" ? "alpha" : "testnet"
  }.png`,
  url = HOST,
}: Props) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=0.4" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />

      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <title>{title}</title>
    </Head>
  );
}

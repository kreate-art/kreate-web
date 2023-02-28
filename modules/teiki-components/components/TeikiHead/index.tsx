import Head from "next/head";

import {
  NEXT_PUBLIC_HOST,
  NEXT_PUBLIC_NETWORK,
} from "../../../../config/client";

type Props = {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
};

export default function TeikiHead({
  title = "Teiki - A decentralized crowdfunding protocol on Cardano",
  description = "Teiki utilizes Cardano's liquid staking, where backers stake ADA at smart contracts to generate rewards for creators. We integrate AI to minimize the time one needs to raise funding and manage a community.",
  imageUrl = `${NEXT_PUBLIC_HOST}/images/meta-${
    NEXT_PUBLIC_NETWORK === "Mainnet" ? "alpha" : "testnet"
  }.png`,
  url = NEXT_PUBLIC_HOST,
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

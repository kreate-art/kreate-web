import Head from "next/head";

import { HOST } from "@/modules/env/client";

import {} from "../../../../config/client";

type Props = {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
};

export default function TeikiHead({
  title = "Kreate with your Community",
  description = "Kreate is a Web3 membership platform using advanced technologies to innovate engagement. Kreators make ample income from Members paying for exclusive benefits.",
  imageUrl = `${HOST}/images/meta.png?v=1`,
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

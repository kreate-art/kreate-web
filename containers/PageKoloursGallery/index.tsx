import cx from "classnames";
import * as React from "react";

import metaImage from "../LandingPage/images/meta-image.png";
import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageKolours/containers/NavBar";
import { useAllNfts } from "../PageKolours/hooks/useAllNfts";

import Section from "./components/Section";
import GenesisNftList from "./containers/GenesisNftList";
import KolourList from "./containers/KolourList";
import { useAllMintedKolours } from "./hooks/useAllMintedKolours";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageKoloursGallery({ className, style }: Props) {
  useBodyClasses([styles.body]);

  const [useAllNfts$Response, useAllNfts$Error] = useAllNfts();
  const [useAllMintedKolours$Response, useAllMintedKolours$Error] =
    useAllMintedKolours();
  return (
    <div className={cx(styles.container, className)} style={style}>
      <TeikiHead
        title="Kolour the Metaverse with NFTs"
        description="Kreate Kolours brings a new trend to Web3, where users colour a Metaverse with NFTs. Let's paint a new world with Web3 creators and fans!"
        url="https://kolours.kreate.community"
        imageUrl={metaImage.src}
      />
      <NavBar className={styles.navBar} />
      <Section marginTop="56px" marginBottom="56px">
        <Flex.Col gap="16px">
          <Typography.Div content="Genesis Kreation NFTs" size="heading6" />
          <GenesisNftList
            value={useAllNfts$Response?.kreations?.filter((item) =>
              ["booked", "minted"].includes(item.status)
            )}
            error={useAllNfts$Error}
          />
        </Flex.Col>
      </Section>
      <Section marginTop="56px" marginBottom="56px">
        <Flex.Col gap="16px">
          <Typography.Div content="Kolour NFTs" size="heading6" />
          <KolourList
            value={useAllMintedKolours$Response?.kolours}
            error={useAllMintedKolours$Error}
          />
        </Flex.Col>
      </Section>
      <FooterPanel style={{ width: "100%" }} />
    </div>
  );
}

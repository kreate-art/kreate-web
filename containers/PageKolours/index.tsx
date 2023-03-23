import cx from "classnames";
import * as React from "react";

import Section from "./components/Section";
import NavBar from "./containers/NavBar";
import NftCardGrid from "./containers/NftCardGrid";
import PanelMint from "./containers/PanelMint";
import PanelMintKolours from "./containers/PanelMintKolours";
import { useAllNfts } from "./hooks/useAllNfts";
import styles from "./index.module.scss";

import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageKolours({ className, style }: Props) {
  useDefaultBackground();
  const [allNfts, allNfts$Error] = useAllNfts();

  const [selectedId, setSelectedId] = React.useState<string>();

  const selectedNft = selectedId
    ? allNfts?.nfts?.find((item) => item.id === selectedId)
    : undefined;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <NavBar className={styles.navBar} />
      <Section>
        <PanelMint
          grayscaleImage={selectedNft?.grayscaleImage}
          palette={selectedNft?.palette}
        />
      </Section>
      <Section style={{ opacity: "25%" }}>
        {selectedNft ? (
          <PanelMintKolours
            grayscaleImage={selectedNft.grayscaleImage}
            palette={selectedNft.palette}
          />
        ) : (
          <Typography.Div content="Please select an NFT" />
        )}
      </Section>
      <Section>
        {allNfts ? (
          <NftCardGrid
            value={allNfts.nfts}
            onSelect={(id) => setSelectedId(id)}
          />
        ) : null}
      </Section>
    </div>
  );
}

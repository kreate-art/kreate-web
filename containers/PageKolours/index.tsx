import cx from "classnames";
import * as React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";

import Section from "./components/Section";
import NavBar from "./containers/NavBar";
import NftCardGrid from "./containers/NftCardGrid";
import PanelMint from "./containers/PanelMint";
import { useAllNfts } from "./hooks/useAllNfts";
import styles from "./index.module.scss";

import { HOST } from "@/modules/env/client";
import Menu$TopNavigation from "@/modules/teiki-components/components/Menu$TopNavigation";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageKolours({ className, style }: Props) {
  useDefaultBackground();
  const [allNfts, allNfts$Error] = useAllNfts();

  const [selectedId, setSelectedId] = React.useState<string>();

  const selectedNft = selectedId
    ? allNfts?.kreations?.find((item) => item.id === selectedId)
    : undefined;

  React.useEffect(() => {
    if (!selectedId && !!allNfts?.kreations.length) {
      setSelectedId(allNfts.kreations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!selectedId && !!allNfts?.kreations.length]);

  const selectedIndex =
    selectedId && allNfts?.kreations
      ? allNfts.kreations.findIndex((item) => item.id === selectedId)
      : undefined;
  const prevId =
    selectedIndex != null && allNfts?.kreations
      ? allNfts.kreations[selectedIndex - 1]?.id
      : undefined;
  const nextId =
    selectedIndex != null && allNfts?.kreations
      ? allNfts.kreations[selectedIndex + 1]?.id
      : undefined;

  const sectionMint$Ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <TeikiHead
        title="Kolour the Metaverse with NFTs"
        description="Kreate Kolours brings a new trend to Web3, where users colour a Metaverse with NFTs. Let's paint a new world with Web3 creators and fans!"
        url="https://kolours.kreate.community"
        imageUrl={`${HOST}/images/meta-kolour.png?v=1`}
      />
      <NavBar className={styles.navBar} showGalleryButton={true} />
      <Menu$TopNavigation
        style={{ marginTop: "48px" }}
        items={[
          {
            label: "The Origin of Kolours",
            key: "origins",
            href: "/gallery",
          },
          {
            label: "Your Kolours",
            key: "yours",
            href: "/mint-by-color-picker",
          },
        ]}
        activeKey="origins"
      />
      <Section marginTop="24px" ref={sectionMint$Ref}>
        <PanelMint
          key={selectedId}
          selectedNft={selectedNft}
          initialImage={selectedNft?.initialImage}
          finalImage={selectedNft?.finalImage}
          palette={selectedNft?.palette}
          fee={selectedNft?.fee}
          listedFee={selectedNft?.listedFee}
          status={selectedNft?.status}
          canGoPrev={prevId != null}
          onGoPrev={() => setSelectedId(prevId)}
          canGoNext={nextId != null}
          onGoNext={() => setSelectedId(nextId)}
        />
      </Section>
      <Section marginBottom="56px">
        {allNfts ? (
          <NftCardGrid
            value={allNfts.kreations}
            onSelect={(id) => {
              setSelectedId(id);
              sectionMint$Ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
              });
            }}
          />
        ) : null}
      </Section>
      <FooterPanel style={{ width: "100%" }} />
    </div>
  );
}

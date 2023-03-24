import cx from "classnames";
import * as React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";

import Section from "./components/Section";
import BelowNavBar from "./containers/BelowNavBar";
import NavBar from "./containers/NavBar";
import NftCardGrid from "./containers/NftCardGrid";
import PanelMint from "./containers/PanelMint";
import { useAllNfts } from "./hooks/useAllNfts";
import styles from "./index.module.scss";

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
      <TeikiHead />
      <NavBar className={styles.navBar} />
      {/* <BelowNavBar /> */}
      <Section marginTop="24px" ref={sectionMint$Ref}>
        <PanelMint
          key={selectedId}
          initialImage={selectedNft?.initialImage}
          finalImage={selectedNft?.finalImage}
          palette={selectedNft?.palette}
          fee={selectedNft?.fee}
          listedFee={selectedNft?.listedFee}
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

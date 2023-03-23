import cx from "classnames";
import * as React from "react";

import Section from "./components/Section";
import NavBar from "./containers/NavBar";
import NftCardGrid from "./containers/NftCardGrid";
import PanelMint from "./containers/PanelMint";
import { useAllNfts } from "./hooks/useAllNfts";
import styles from "./index.module.scss";

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

  return (
    <div className={cx(styles.container, className)} style={style}>
      <NavBar className={styles.navBar} />
      <Section marginTop="24px">
        <PanelMint
          key={selectedId}
          initialImage={selectedNft?.initialImage}
          palette={selectedNft?.palette}
          fee={selectedNft?.fee}
          listedFee={selectedNft?.listedFee}
        />
      </Section>
      <Section>
        {allNfts ? (
          <NftCardGrid
            value={allNfts.kreations}
            onSelect={(id) => setSelectedId(id)}
          />
        ) : null}
      </Section>
    </div>
  );
}

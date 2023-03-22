import cx from "classnames";
import * as React from "react";

import Section from "./components/Section";
import NavBar from "./containers/NavBar";
import NftCardGrid from "./containers/NftCardGrid";
import PanelMintKolours from "./containers/PanelMintKolours";
import { useAllNfts } from "./hooks/useAllNfts";
import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageKolours({ className, style }: Props) {
  const [allNfts, allNfts$Error] = useAllNfts();

  const [selectedId, setSelectedId] = React.useState<string>();

  const selectedNft = selectedId
    ? allNfts?.nfts?.find((item) => item.id === selectedId)
    : undefined;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <NavBar className={styles.navBar} />
      <Section>
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

/* <PanelMintKolours
        grayscaleImage={{
          src: "https://s3-alpha-sig.figma.com/img/f459/29f6/e1c1c324c8745ef4a2cd65053d2046ef?Expires=1680480000&Signature=KRLpZkW1pRiu6hYF9iVtOuEjQuv3rCd3gBdhqYxtI4DxUVav7x31IMb1hQBl3y5ClY2kSJsRNB000wRpuRRkGH1NAQOrteqLgH3q-5D8rEa-4iMGnZ7D9ZSJIagESITPm236-5hbUP2Cb-EV7qB7LWTKE7U6a0crira3yROPcaVqs80ncam2GtSPRi8gcQJ8tMrU1JmVzhZy8bHeqIulA6VHrJA0LR6HWiRJ1Jl~zGRetr-pU-ZZ9XsBAqd8W9J19cJdlIDro4hasnPvwWzGpxM4YhtY07WG1muBN31QpBzzU1MTGFadiNEHWEn27IJOcl6X~lQAt6-gR85X4ndnkA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
        }}
        palette={[
          {
            color: "#F0325B",
            associatedImage: {
              src: "https://s3-alpha-sig.figma.com/img/f459/29f6/e1c1c324c8745ef4a2cd65053d2046ef?Expires=1680480000&Signature=KRLpZkW1pRiu6hYF9iVtOuEjQuv3rCd3gBdhqYxtI4DxUVav7x31IMb1hQBl3y5ClY2kSJsRNB000wRpuRRkGH1NAQOrteqLgH3q-5D8rEa-4iMGnZ7D9ZSJIagESITPm236-5hbUP2Cb-EV7qB7LWTKE7U6a0crira3yROPcaVqs80ncam2GtSPRi8gcQJ8tMrU1JmVzhZy8bHeqIulA6VHrJA0LR6HWiRJ1Jl~zGRetr-pU-ZZ9XsBAqd8W9J19cJdlIDro4hasnPvwWzGpxM4YhtY07WG1muBN31QpBzzU1MTGFadiNEHWEn27IJOcl6X~lQAt6-gR85X4ndnkA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
            },
            checked: false,
            minted: false,
          },
          {
            color: "#B44866",
            associatedImage: {
              src: "https://s3-alpha-sig.figma.com/img/f459/29f6/e1c1c324c8745ef4a2cd65053d2046ef?Expires=1680480000&Signature=KRLpZkW1pRiu6hYF9iVtOuEjQuv3rCd3gBdhqYxtI4DxUVav7x31IMb1hQBl3y5ClY2kSJsRNB000wRpuRRkGH1NAQOrteqLgH3q-5D8rEa-4iMGnZ7D9ZSJIagESITPm236-5hbUP2Cb-EV7qB7LWTKE7U6a0crira3yROPcaVqs80ncam2GtSPRi8gcQJ8tMrU1JmVzhZy8bHeqIulA6VHrJA0LR6HWiRJ1Jl~zGRetr-pU-ZZ9XsBAqd8W9J19cJdlIDro4hasnPvwWzGpxM4YhtY07WG1muBN31QpBzzU1MTGFadiNEHWEn27IJOcl6X~lQAt6-gR85X4ndnkA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
            },
            checked: false,
            minted: false,
          },
          {
            color: "#EBDED2",
            associatedImage: {
              src: "https://s3-alpha-sig.figma.com/img/f459/29f6/e1c1c324c8745ef4a2cd65053d2046ef?Expires=1680480000&Signature=KRLpZkW1pRiu6hYF9iVtOuEjQuv3rCd3gBdhqYxtI4DxUVav7x31IMb1hQBl3y5ClY2kSJsRNB000wRpuRRkGH1NAQOrteqLgH3q-5D8rEa-4iMGnZ7D9ZSJIagESITPm236-5hbUP2Cb-EV7qB7LWTKE7U6a0crira3yROPcaVqs80ncam2GtSPRi8gcQJ8tMrU1JmVzhZy8bHeqIulA6VHrJA0LR6HWiRJ1Jl~zGRetr-pU-ZZ9XsBAqd8W9J19cJdlIDro4hasnPvwWzGpxM4YhtY07WG1muBN31QpBzzU1MTGFadiNEHWEn27IJOcl6X~lQAt6-gR85X4ndnkA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
            },
            checked: false,
            minted: false,
          },
          {
            color: "#E69C4D",
            associatedImage: {
              src: "https://s3-alpha-sig.figma.com/img/f459/29f6/e1c1c324c8745ef4a2cd65053d2046ef?Expires=1680480000&Signature=KRLpZkW1pRiu6hYF9iVtOuEjQuv3rCd3gBdhqYxtI4DxUVav7x31IMb1hQBl3y5ClY2kSJsRNB000wRpuRRkGH1NAQOrteqLgH3q-5D8rEa-4iMGnZ7D9ZSJIagESITPm236-5hbUP2Cb-EV7qB7LWTKE7U6a0crira3yROPcaVqs80ncam2GtSPRi8gcQJ8tMrU1JmVzhZy8bHeqIulA6VHrJA0LR6HWiRJ1Jl~zGRetr-pU-ZZ9XsBAqd8W9J19cJdlIDro4hasnPvwWzGpxM4YhtY07WG1muBN31QpBzzU1MTGFadiNEHWEn27IJOcl6X~lQAt6-gR85X4ndnkA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
            },
            checked: false,
            minted: false,
          },
        ]}
      /> */

import cx from "classnames";

import WithAspectRatio from "../../components/WithAspectRatio";
import NavBar from "../PageKolours/containers/NavBar";

import Section from "./components/Section";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { HOST } from "@/modules/env/client";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import ImageView from "@/modules/teiki-components/components/ImageView";
import Flex from "@/modules/teiki-components/components/PanelProjectOverview/components/Flex";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: GenesisKreationEntry;
};

export default function PageKoloursGalleryDetails({
  className,
  style,
  value,
}: Props) {
  useBodyClasses([styles.body]);
  return (
    <div className={cx(styles.container, className)} style={style}>
      <TeikiHead
        title="Kolour the Metaverse with NFTs"
        description="Kreate Kolours brings a new trend to Web3, where users colour a Metaverse with NFTs. Let's paint a new world with Web3 creators and fans!"
        url="https://kolours.kreate.community"
        imageUrl={`${HOST}/images/meta-kolour.png?v=1`}
      />
      <NavBar className={styles.navBar} showMintButton={true} />
      <Section marginTop="32px">
        <Flex.Col className={styles.upper}>
          <WithAspectRatio aspectRatio={2 / 1} className={styles.border}>
            <ImageView
              className={styles.image}
              src={value.finalImage.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          </WithAspectRatio>
          <Typography.Span content={value.name} size="heading1" />
          <Typography.Span
            content={value.description}
            className={styles.text}
            color="ink80"
          />
          <Typography.Span>
            Owner:{" "}
            <InlineAddress
              value={value.userAddress ?? "Cant find owner"}
              length="short"
            />
          </Typography.Span>
        </Flex.Col>
      </Section>
    </div>
  );
}

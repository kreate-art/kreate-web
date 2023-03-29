import cx from "classnames";
import React from "react";

import WithAspectRatio from "../../components/WithAspectRatio";
import NavBar from "../PageKolours/containers/NavBar";
import { toHexColor } from "../PageKolours/utils";

import Section from "./components/Section";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { HOST } from "@/modules/env/client";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import ImageView from "@/modules/teiki-components/components/ImageView";
import Flex from "@/modules/teiki-components/components/PanelProjectOverview/components/Flex";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
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
  const [lowerElement, setLowerElement] = React.useState<HTMLDivElement | null>(
    null
  );
  const lowerSize = useElementSize(lowerElement);
  const numColumn = lowerSize ? Math.ceil(lowerSize.w / 400) : 1;
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

      <Section marginTop="32px">
        <Flex.Col
          padding="24px 48px 32px 48px"
          gap="26px"
          style={{ borderRadius: "4px", backgroundColor: "#fff" }}
        >
          <Typography.Div content="Kolours" size="heading4" />
          <Divider$Horizontal$CustomDash />
          <div ref={setLowerElement}>
            <div
              className={styles.grid}
              style={{ gridTemplateColumns: `repeat(${numColumn}, 1fr)` }}
            >
              {value.palette.map((item, index) => (
                <Flex.Row
                  padding="12px 20px"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{
                    border: "1px solid rgba(34, 34, 34, 0.1)",
                    borderRadius: "12px",
                  }}
                  key={index}
                >
                  <Flex.Row alignItems="center" gap="8px">
                    <div
                      style={{
                        backgroundColor: toHexColor(item.kolour),
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography.Div
                      content={toHexColor(item.kolour)}
                      size="heading6"
                    />
                  </Flex.Row>
                  <Flex.Row alignItems="center" gap="4px">
                    <Typography.Span content="1%" size="heading6" />
                    <Typography.Span
                      content={toHexColor(item.kolour)}
                      size="bodySmall"
                      color="secondary80"
                    />
                  </Flex.Row>
                </Flex.Row>
              ))}
            </div>
          </div>
        </Flex.Col>
      </Section>
    </div>
  );
}

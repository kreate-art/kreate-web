import assetFingerprint from "@emurgo/cip14-js";
import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import NavBar from "../PageKolours/containers/NavBar";
import { toHexColor } from "../PageKolours/utils";

import Section from "./components/Section";
import { useMintedKolour } from "./hooks/useMintedKolour";
import IconCrown from "./icons/IconCrown";
import IconSeparator from "./icons/IconSeparator";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { HOST } from "@/modules/env/client";
import { KOLOURS_KOLOUR_NFT_POLICY_ID } from "@/modules/env/kolours/client";
import { Kolour } from "@/modules/kolours/types/Kolours";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  kolour: Kolour;
};

export default function PageKolourDetails({ className, style, kolour }: Props) {
  useBodyClasses([styles.body]);
  const [mintedKolour$Response, mintedKolour$Error] = useMintedKolour({
    kolour,
  });

  if (mintedKolour$Error) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        <MessageBox title="Error" />
      </div>
    );
  }

  if (!mintedKolour$Response) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        <MessageBox title="Loading" />
      </div>
    );
  }

  const mintedKolour = mintedKolour$Response.mintedKolour;

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
        <Flex.Row gap="20px">
          <Flex.Cell
            className={styles.leftPanel}
            flex="5 5 100px"
            style={{ backgroundColor: toHexColor(kolour) }}
          ></Flex.Cell>
          <Flex.Col
            className={styles.rightPanel}
            flex="7 7 350px "
            padding="48px 0"
            gap="32px"
          >
            {/* kolour, owner, royalty percentage */}
            <Flex.Col padding="0 56px" gap="16px">
              <Typography.H1
                size="heading1"
                color="ink"
                content={toHexColor(kolour)}
              />
              <Flex.Row alignItems="center" gap="12px">
                <Typography.Div>
                  <Typography.Span content="Owner: " />
                  <Typography.Span fontWeight="semibold" color="primary">
                    <InlineAddress
                      length="short"
                      value={mintedKolour.userAddress}
                    />
                  </Typography.Span>
                </Typography.Div>
                <IconSeparator />
                <Flex.Row alignItems="center" gap="12px">
                  <IconCrown style={{ color: "#FFB743" }} />
                  <Typography.Div fontWeight="bold" content="1% Royalties" />
                </Flex.Row>
              </Flex.Row>
            </Flex.Col>
            {/* minted time, minted fee, expected earning */}
            <Flex.Col padding="0 56px" gap="24px">
              <Divider$Horizontal$CustomDash />
              <Flex.Row flexWrap="wrap" gap="24px 12px">
                {/* TODO: @sk-kitsune: add minted time */}
                {/* <Flex.Row
                  className={styles.infoCell}
                  flex="1 1 300px"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="12px 24px"
                >
                  <Typography.Div color="ink80" content="Minted Time" />
                  <Typography.Div
                    fontWeight="semibold"
                    content={}
                  />
                </Flex.Row> */}
                <Flex.Row
                  className={styles.infoCell}
                  flex="1 1 300px"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="12px 24px"
                >
                  <Typography.Div color="ink80" content="Minted Fee" />
                  <AssetViewer.Ada.Compact
                    as="div"
                    lovelaceAmount={mintedKolour.fee}
                    size="heading6"
                    color="ink"
                    fontWeight="semibold"
                  />
                </Flex.Row>
                <Flex.Row
                  className={styles.infoCell}
                  flex="1 1 300px"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="12px 24px"
                >
                  <Typography.Div color="ink80" content="Expected Earning" />
                  <AssetViewer.Ada.Compact
                    as="div"
                    lovelaceAmount={mintedKolour.expectedEarning ?? undefined}
                    size="heading6"
                    color="ink"
                    fontWeight="semibold"
                  />
                </Flex.Row>
              </Flex.Row>
              <Divider$Horizontal$CustomDash />
            </Flex.Col>
            {/* view on pool.pm button, share button */}
            <Flex.Row padding="0 56px" gap="24px">
              <Link href={toPoolpmUrl(kolour)}>
                <Button.Outline as="div" content="View on Pool.pm" />
              </Link>
              {/* <Button.Outline
                icon={<IconTwitter width="20" height="20" />}
                color="secondary"
                size="extraSmall"
                circular
              /> */}
            </Flex.Row>
          </Flex.Col>
        </Flex.Row>
      </Section>
    </div>
  );
}

function kolourToBech32(kolour: Kolour) {
  return assetFingerprint
    .fromParts(
      Buffer.from(KOLOURS_KOLOUR_NFT_POLICY_ID, "hex"),
      Buffer.from(`#${kolour}`, "utf-8")
    )
    .fingerprint();
}

function toPoolpmUrl(kolour: Kolour) {
  return `https://pool.pm/${kolourToBech32(kolour)}`;
}

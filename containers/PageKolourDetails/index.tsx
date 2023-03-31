import assetFingerprint from "@emurgo/cip14-js";
import cx from "classnames";
import moment from "moment";
import Link from "next/link";
import * as React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";
import { getSocialMediaInfo } from "../PageKolours/containers/ModalMintKoloursSuccess/containers/SocialMedia";
import NavBar from "../PageKolours/containers/NavBar";
import { useAllNftsForGallery } from "../PageKolours/hooks/useAllNftsForGallery";
import { toHexColor } from "../PageKolours/utils";
import GenesisNftList from "../PageKoloursGallery/containers/GenesisNftList";

import Section from "./components/Section";
import { useMintedKolour } from "./hooks/useMintedKolour";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { HOST } from "@/modules/env/client";
import { KOLOURS_KOLOUR_NFT_POLICY_ID } from "@/modules/env/kolours/client";
import { Kolour } from "@/modules/kolours/types/Kolours";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import AddressViewer from "@/modules/teiki-ui/components/AddressViewer";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
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
  // TODO: @sk-kitsune: currently, the number of Genesis NFTs is pretty small,
  // therefore, we can just fetch all then filter in frontend. By right, we should
  // pass some queries to BE then let BE filter.
  const [allNfts$Response, allNfts$Error] = useAllNftsForGallery();
  const relatedNfts = allNfts$Response?.kreations?.filter((item) =>
    item.palette.some((item) => item === kolour)
  );

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
      <div className={styles.main}>
        <Section marginTop="32px" marginBottom="16px">
          <Flex.Row gap="20px">
            <Flex.Cell
              className={styles.leftPanel}
              flex="5 5 350px"
              style={{ backgroundColor: toHexColor(kolour) }}
            />
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
                      <AddressViewer
                        size={"heading6"}
                        value={mintedKolour.userAddress}
                      />
                    </Typography.Span>
                  </Typography.Div>
                </Flex.Row>
              </Flex.Col>
              {/* minted time, minted fee, expected earning */}
              <Flex.Col padding="0 56px" gap="32px">
                <Divider$Horizontal$CustomDash />
                <Flex.Col gap="12px">
                  <Flex.Row
                    className={styles.infoCell}
                    justifyContent="space-between"
                    alignItems="center"
                    padding="12px 24px"
                  >
                    <Typography.Div color="ink80" content="Minted Time" />
                    <Typography.Div
                      fontWeight="semibold"
                      content={moment(mintedKolour.createdAt).format(
                        "MMM DD, yyyy, hh:mm A"
                      )}
                    />
                  </Flex.Row>
                  <Flex.Row
                    className={styles.infoCell}
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
                    justifyContent="space-between"
                    alignItems="center"
                    padding="12px 24px"
                  >
                    <Typography.Div color="ink80" content="Royalties" />
                    <Typography.Div
                      color="secondary"
                      content="1%"
                      size="heading6"
                    />
                  </Flex.Row>
                  <Flex.Row
                    className={styles.infoCell}
                    justifyContent="space-between"
                    alignItems="center"
                    padding="12px 24px"
                  >
                    <Typography.Div color="ink80" content="Expected Earning" />
                    <AssetViewer.Ada.Compact
                      as="div"
                      lovelaceAmount={mintedKolour.expectedEarning}
                      size="heading6"
                      color="ink"
                      fontWeight="semibold"
                    />
                  </Flex.Row>
                </Flex.Col>
                <Divider$Horizontal$CustomDash />
              </Flex.Col>
              {/* view on pool.pm button, share button */}
              <Flex.Row padding="0 56px" gap="24px" alignItems="center">
                <Link
                  href={toPoolpmUrl(kolour)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button.Outline as="div" content="View on Pool.pm" />
                </Link>
                <Divider.Vertical />
                <Flex.Row gap="12px" alignItems="center">
                  <Typography.Div
                    content="Share"
                    size="heading6"
                    style={{ marginRight: "4px" }}
                  />
                  {["twitter", "telegram", "reddit"].map((key) => {
                    const { icon, sharerLink } = getSocialMediaInfo(key);
                    const navUrl =
                      sharerLink + encodeURIComponent(window.location.href);
                    return (
                      <Link
                        href={navUrl}
                        key={key}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button.Outline
                          icon={icon}
                          circular={true}
                          size="extraSmall"
                        />
                      </Link>
                    );
                  })}
                </Flex.Row>
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
        <Section marginTop="16px" marginBottom="32px">
          <Flex.Col className={styles.panelAsSeenIn} alignItems="stretch">
            <Flex.Row padding="24px 48px">
              <Typography.H2 size="heading5" color="ink" content="As Seen In" />
            </Flex.Row>
            <Divider$Horizontal$CustomDash />
            <Flex.Row padding="24px 48px">
              <GenesisNftList
                value={relatedNfts}
                error={allNfts$Error}
                displayOptions={{ card: { border: "solid" } }}
              />
            </Flex.Row>
          </Flex.Col>
        </Section>
      </div>
      <FooterPanel />
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

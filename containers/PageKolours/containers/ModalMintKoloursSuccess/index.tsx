import assetFingerprint from "@emurgo/cip14-js";
import cx from "classnames";
import Link from "next/link";
import React from "react";

import SocialMedia from "./containers/SocialMedia";
import styles from "./index.module.scss";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { KOLOURS_KOLOUR_NFT_POLICY_ID } from "@/modules/env/kolours/client";
import { Kolour, KolourEntry } from "@/modules/kolours/types/Kolours";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";
import { getExplorerUrl } from "@/modules/urls";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  onClose?: () => void;
  txHash: string;
  value: [Kolour, KolourEntry][];
};

export default function ModalMintKoloursSuccess({
  className,
  style,
  open,
  onClose,
  txHash,
  value,
}: Props) {
  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(containerElement);
  const numColumn = containerSize ? Math.ceil(containerSize.w / 300) : 1;
  const listSocialMedia = ["twitter", "telegram", "reddit"];
  const kolours = value.map(([kolour, _]) => kolour);

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

  function joinWithAnd(kolours: Kolour[]) {
    const values = kolours.map((kolour) => `#${kolour}`);
    if (values.length === 0) return "";
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    const last = values.pop();
    return values.join(", ") + " and " + last;
  }

  const message = `🏔️ Just left my mark in the Kreataverse with ${joinWithAnd(
    kolours
  )}!\n🎨 Come colour a Metaverse with me @KreatePlatform:\nhttps://kolours.kreate.community/mint\n\n${kolours
    .map((kolour) => toPoolpmUrl(kolour))
    .join("\n")}`;

  return (
    <Modal
      className={cx(styles.container, className)}
      style={style}
      open={open}
      onClose={onClose}
      closeOnDimmerClick
      closeOnEscape
    >
      <Modal.Header>
        <Typography.Div
          content="Mint Genesis Kreation"
          color="secondary"
          size="heading4"
        />
      </Modal.Header>
      <Modal.Content padding="none">
        <div ref={setContainerElement}>
          <Flex.Col alignItems="center" padding="32px 48px" gap="32px">
            <div
              className={styles.grid}
              style={{
                gridTemplateColumns: `repeat(${numColumn}, 1fr)`,
                gridAutoFlow: "row",
              }}
            >
              {value.map(([kolour, _], index) => (
                <Flex.Col key={index} className={styles.card}>
                  <div
                    style={{
                      backgroundColor: `#${kolour}`,
                      color: "#fff",
                      width: "100%",
                      padding: "66px 68px",
                    }}
                  />
                  <Flex.Row alignItems="center" gap="12px" padding="16px 72px">
                    <Typography.Div content={`#${kolour}`} size="heading6" />
                  </Flex.Row>
                </Flex.Col>
              ))}
            </div>
            <Typography.Div
              size="heading4"
              content={`Your Kolour${
                value.length > 1 ? "s have" : " has"
              } been minted successfully!`}
              color="secondary"
            />
            <Flex.Col gap="16px">
              <Flex.Row gap="16px" alignItems="center" justifyContent="center">
                <Typography.Div
                  content="Share"
                  size="heading6"
                  color="secondary"
                />
                <Flex.Row gap="12px" alignItems="center">
                  {listSocialMedia.map((socialMedia, index) => (
                    <SocialMedia
                      value={socialMedia}
                      key={index}
                      shareValue={message}
                    />
                  ))}
                </Flex.Row>
              </Flex.Row>
              <Divider$Horizontal$CustomDash />
              <Flex.Row gap="24px" alignItems="center" justifyContent="center">
                <Button.Outline content="Back" onClick={onClose} />
                <Link href={getExplorerUrl(txHash)} target="_blank">
                  <Button.Outline content="View Transaction" />
                </Link>
              </Flex.Row>
            </Flex.Col>
          </Flex.Col>
        </div>
      </Modal.Content>
    </Modal>
  );
}

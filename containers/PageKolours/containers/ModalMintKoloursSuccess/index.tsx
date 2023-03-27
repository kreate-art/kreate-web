import cx from "classnames";
import Link from "next/link";
import React from "react";

import SocialMedia from "./containers/SocialMedia";
import styles from "./index.module.scss";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { Kolour, KolourEntry } from "@/modules/kolours/types/Kolours";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";
import { getExplorerUrl, getIpfsUrl } from "@/modules/urls";

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
                      shareValue={
                        value.length > 1
                          ? getExplorerUrl(txHash)
                          : getIpfsUrl(value[0][1].image.replace("ipfs://", ""))
                      }
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

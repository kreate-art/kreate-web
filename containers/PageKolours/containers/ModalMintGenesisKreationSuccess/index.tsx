import assetFingerprint from "@emurgo/cip14-js";
import cx from "classnames";
import Link from "next/link";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import SocialMedia from "../ModalMintKoloursSuccess/containers/SocialMedia";

import styles from "./index.module.scss";

import { KOLOURS_GENESIS_KREATION_POLICY_ID } from "@/modules/env/kolours/client";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import ImageView from "@/modules/teiki-components/components/ImageView";
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
  value: GenesisKreationEntry;
};

export default function ModalMintGenesisKreationSuccess({
  className,
  style,
  open,
  onClose,
  txHash,
  value,
}: Props) {
  const asset$Bech32 = assetFingerprint
    .fromParts(
      Buffer.from(KOLOURS_GENESIS_KREATION_POLICY_ID, "hex"),
      Buffer.from(value.id, "utf-8")
    )
    .fingerprint();
  const message = `🏔️ Just left my mark in the Kreataverse with ${value.id}!\n🎨 Come colour a Metaverse with me @KreatePlatform:\nhttps://kolours.kreate.community/mint\n\nhttps://pool.pm/${asset$Bech32}`;
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
      <Modal.Content padding="none">
        <Flex.Col alignItems="center" padding="32px 48px" gap="32px">
          <WithAspectRatio
            aspectRatio={2 / 1}
            className={styles.imageContainer}
          >
            <ImageView
              className={styles.image}
              src={value.finalImage.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          </WithAspectRatio>
          <Typography.Div
            size="heading4"
            content={`Your Genesis Kreation has been minted successfully!`}
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
      </Modal.Content>
    </Modal>
  );
}

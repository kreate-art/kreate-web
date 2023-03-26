import cx from "classnames";
import Image from "next/image";
import Link from "next/link";

import WithAspectRatio from "../../../../components/WithAspectRatio";

import imageSuccess from "./image/success.png";
import styles from "./index.module.scss";

import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import ImageView from "@/modules/teiki-components/components/ImageView";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";
import { getExplorerUrl } from "@/modules/urls";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  onClose?: () => void;
  txHash: string;
  genesisKreation?: GenesisKreationEntry;
};

export default function ModalMintSuccess({
  className,
  style,
  open,
  onClose,
  txHash,
  genesisKreation,
}: Props) {
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
        <Flex.Col alignItems="center" padding="64px 32px">
          {genesisKreation ? (
            <WithAspectRatio
              aspectRatio={2 / 1}
              className={styles.imageContainer}
            >
              <ImageView
                className={styles.image}
                src={genesisKreation.finalImage.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          ) : (
            <Image
              className={styles.imageSuccess}
              src={imageSuccess}
              alt="niko firework"
            />
          )}
          <Title
            className={styles.caption}
            size="h2"
            color="ink"
            content="Your NFT has been minted!"
          />
          <Flex.Row gap="24px" alignItems={"center"}>
            <Button.Outline className={styles.button} onClick={onClose}>
              Back
            </Button.Outline>
            <Link
              href={getExplorerUrl(txHash)}
              target="_blank"
              className={styles.button}
            >
              <Button.Outline content="View Tx" />
            </Link>
          </Flex.Row>
        </Flex.Col>
      </Modal.Content>
    </Modal>
  );
}

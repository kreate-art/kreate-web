import cx from "classnames";
import Image from "next/image";
import Link from "next/link";

import imageSuccess from "./image/success.png";
import styles from "./index.module.scss";

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
};

export default function ModalMintSuccess({
  className,
  style,
  open,
  onClose,
  txHash,
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
          <Image
            className={styles.imageSuccess}
            src={imageSuccess}
            alt="niko firework"
          />
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

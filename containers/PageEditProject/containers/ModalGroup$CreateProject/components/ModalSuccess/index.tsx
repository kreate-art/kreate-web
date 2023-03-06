import cx from "classnames";
import Image from "next/image";
import * as React from "react";

import imageSuccess from "./images/success.png";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  onClose?: () => void;
};

export default function ModalSuccess({
  className,
  style,
  open,
  onClose,
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
          <Title className={styles.caption} size="h1" color="ink">
            Project Successfully Created
          </Title>
          <Button.Solid className={styles.button} onClick={onClose}>
            Go to Project
          </Button.Solid>
        </Flex.Col>
      </Modal.Content>
    </Modal>
  );
}

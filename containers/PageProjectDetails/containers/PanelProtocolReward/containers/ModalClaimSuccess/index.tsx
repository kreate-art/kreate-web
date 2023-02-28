import Image from "next/image";
import * as React from "react";

import imageNiko from "./images/niko.png";
import styles from "./index.module.scss";

import { getExplorerUrl } from "@/modules/common-utils";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  open: boolean;
  onClose: () => void;
  projectTitle: string | undefined;
  txHash: string | undefined;
};

export default function ModalClaimSuccess({
  open,
  onClose,
  projectTitle,
  txHash,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} closeOnEscape closeOnDimmerClick>
      <Modal.Header>
        <Typography.Span color="ink" content="Claim Reward: " />
        <Typography.Span color="green" content={projectTitle} />
      </Modal.Header>
      <Modal.Content>
        <Flex.Col alignItems="center">
          <Image className={styles.imageNiko} src={imageNiko} alt="niko" />
          <Typography.Div
            style={{ marginTop: "32px" }}
            size="heading4"
            content="Your claim is completed!"
          />
          <Flex.Row style={{ marginTop: "24px" }} gap="12px">
            <Button.Outline content="Close" onClick={onClose} />
            <Button.Outline
              content="Check your Tx"
              onClick={() => {
                txHash &&
                  window.open(
                    getExplorerUrl(txHash),
                    "_blank",
                    "noopener,noreferrer"
                  );
              }}
            />
          </Flex.Row>
        </Flex.Col>
      </Modal.Content>
    </Modal>
  );
}

import Image from "next/image";
import Link from "next/link";

import imageSuccess from "./images/success.png";
import styles from "./index.module.scss";

import Flex from "@/modules/teiki-components/components/PanelProjectOverview/components/Flex";
import Button from "@/modules/teiki-ui/components/Button";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";
import { getExplorerUrl } from "@/modules/urls";

type Props = {
  open: boolean;
  projectName: string;
  txHash: string;
  onBackToProject?: () => void;
  onContinueToClose?: () => void;
  onViewWithdrawalHistory?: () => void;
};

export default function ModalWithdrawSuccess({
  open,
  projectName,
  txHash,
  onBackToProject,
  onContinueToClose,
  onViewWithdrawalHistory,
}: Props) {
  return (
    <Modal open={open} closeOnEscape closeOnDimmerClick>
      <Modal.Header>
        <span>{"Withdraw Income: "}</span>
        <span style={{ color: "#008A45" }}>{projectName}</span>
      </Modal.Header>
      <Modal.Content>
        <Flex.Col alignItems="center">
          <Image
            className={styles.imageSuccess}
            src={imageSuccess}
            alt="niko firework"
          />
          <Title className={styles.caption} size="h4" color="ink">
            Woohoo! Your withdrawal is completed!
          </Title>

          <Flex.Row padding="24px 94px 32px 94px" gap="12px">
            <Button.Outline content="Back" onClick={onBackToProject} />
            <Link href={getExplorerUrl(txHash)} target="_blank">
              <Button.Outline content="Check your Tx" />
            </Link>
            {onContinueToClose != null ? (
              <Button.Solid
                content="Continue closing"
                onClick={onContinueToClose}
              />
            ) : onViewWithdrawalHistory != null ? (
              <Button.Solid
                content="View Withdrawal History"
                disabled
                onClick={onViewWithdrawalHistory}
              />
            ) : null}
          </Flex.Row>
        </Flex.Col>
      </Modal.Content>
    </Modal>
  );
}

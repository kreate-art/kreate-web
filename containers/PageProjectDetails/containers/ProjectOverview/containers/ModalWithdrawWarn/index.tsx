import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import Flex from "@/modules/teiki-components/components/PanelProjectOverview/components/Flex";
import Button from "@/modules/teiki-ui/components/Button";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  open: boolean;
  projectName: string;
  withdrawableFundLovelaceAmount: LovelaceAmount;
  onCancel: () => void;
  onClick: () => void;
};

export default function ModalWithdrawWarn({
  open,
  projectName,
  withdrawableFundLovelaceAmount,
  onCancel,
  onClick,
}: Props) {
  return (
    <Modal
      className={styles.container}
      open={open}
      closeOnEscape
      closeOnDimmerClick
    >
      <Modal.Header>
        <Typography.Div size="heading4" maxLines={1} color="green">
          <Typography.Span content="Close: " color="ink" />
          <Typography.Span content={projectName} />
        </Typography.Div>
      </Modal.Header>
      <Modal.Content className={styles.modalContent}>
        <fieldset className={styles.fieldset}>
          <MessageBox
            style={{
              whiteSpace: "pre-line",
              marginBottom: "16px",
              gap: "12px",
            }}
            title={`You have ${formatLovelaceAmount(
              withdrawableFundLovelaceAmount,
              { compact: true, includeCurrencySymbol: true }
            )} unwithdrawn!`}
            description="You must withdraw all income before closing."
          />
        </fieldset>
      </Modal.Content>
      <Modal.Actions>
        <Flex.Row gap="12px">
          <Button.Outline content="Exit" onClick={onCancel} />
          <Button.Solid content="Withdraw Income" onClick={onClick} />
        </Flex.Row>
      </Modal.Actions>
    </Modal>
  );
}

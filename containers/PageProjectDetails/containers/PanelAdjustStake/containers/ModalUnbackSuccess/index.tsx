import Image from "next/image";

import IconHouseCheck from "./icons/IconHouseCheck";
import nikoCongrats from "./images/niko-congrats.png";
import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  open: boolean;
  unbackedAmountLovelace: LovelaceAmount;
  projectName: string;
  onClose: () => void;
};

export default function ModalUnbackSuccess({
  open,
  unbackedAmountLovelace,
  projectName,
  onClose,
}: Props) {
  return (
    <Modal open={open}>
      <div className={styles.modalCongratsContainer}>
        <Image
          src={nikoCongrats}
          alt={"Niko Congrats"}
          width={302}
          height={198}
        />
        <Title
          className={styles.titleCongrats}
          size={"h1"}
          content={"Your unbacking is completed"}
        />
        <div className={styles.congratsContent}>
          <span>You have withdrawn </span>
          <span className={styles.lovelaceWithdrawn}>
            {unbackedAmountLovelace != null
              ? formatLovelaceAmount(unbackedAmountLovelace, {
                  includeCurrencySymbol: true,
                })
              : null}
          </span>
        </div>
        <Button.Solid
          className={styles.buttonBack}
          icon={<IconHouseCheck />}
          content={"Close"}
          size="large"
          onClick={onClose}
        />
      </div>
    </Modal>
  );
}

import Image from "next/image";

import IconHouseCheck from "./icons/IconHouseCheck";
import nikoCongrats from "./images/niko-congrats.png";
import styles from "./index.module.scss";

import { LovelaceAmount } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
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
            <AssetViewer.Ada.Standard
              as="span"
              lovelaceAmount={unbackedAmountLovelace}
            />
            <span>{" ("}</span>
            <AssetViewer.Usd.FromAda
              as="span"
              lovelaceAmount={unbackedAmountLovelace}
            />
            <span>{")"}</span>
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

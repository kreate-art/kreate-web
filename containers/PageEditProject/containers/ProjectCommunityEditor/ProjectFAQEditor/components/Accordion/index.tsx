import * as React from "react";

import IconArrowDropDown from "./icons/IconArrowDropDown";
import IconArrowDropUp from "./icons/IconArrowDropUp";
import IconTrash from "./icons/IconTrash";
import styles from "./index.module.scss";

import Divider from "@/modules/teiki-ui/components/Divider";
import Title from "@/modules/teiki-ui/components/Title";

const Accordion = ({
  children,
  title,
  onRemove,
}: {
  children: React.ReactNode;
  title: string;
  onRemove?: () => void;
}) => {
  const [isOpened, setIsOpened] = React.useState(true);
  return (
    <div className={styles.container}>
      <div className={styles.head} onClick={() => setIsOpened(!isOpened)}>
        <Title>{title}</Title>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={onRemove}>
            <IconTrash />
          </button>
          <button
            className={styles.button}
            onClick={() => setIsOpened(!isOpened)}
          >
            {isOpened ? <IconArrowDropUp /> : <IconArrowDropDown />}
          </button>
        </div>
      </div>
      {isOpened && (
        <div className={styles.content}>
          <Divider.Horizontal />
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;

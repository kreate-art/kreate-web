import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";
import { Options } from "../../types";

import IconClose from "./icons/IconClose";
import IconEditPencil from "./icons/IconEditPencil";
import IconEditPencilLine from "./icons/IconEditPencilLine";
import IconLeaf from "./icons/IconLeaf";
import IconShare from "./icons/IconShare";
import IconThreeDots from "./icons/IconThreeDots";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  options: Options;
};

export default function ButtonGroup({ className, style, options }: Props) {
  const [closeModalActive, setCloseModalActive] = React.useState(false);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row flex="0 0 auto" padding="32px 56px" gap="12px" flexWrap="wrap">
        {options.buttonBackProject.visible ? (
          <Button.Solid
            icon={<IconLeaf />}
            content={
              options.buttonBackProject.isBacking
                ? "Stake More"
                : "Become a Member"
            }
            disabled={options.buttonBackProject.disabled}
            onClick={() =>
              options.buttonBackProject.onClick &&
              options.buttonBackProject.onClick()
            }
            size="large"
            color="primary"
          />
        ) : null}
        {options.buttonUpdateProject.visible ? (
          <Button.Outline
            icon={<IconEditPencilLine />}
            content="Update"
            disabled={options.buttonUpdateProject.disabled}
            onClick={options.buttonUpdateProject.onClick}
            size="large"
          />
        ) : null}
        {options.buttonPostUpdate.visible ? (
          <Button.Outline
            icon={<IconEditPencil />}
            content="Post"
            disabled={options.buttonPostUpdate.disabled}
            onClick={options.buttonPostUpdate.onClick}
            size="large"
          />
        ) : null}
        {options.buttonShare.visible ? (
          <Button.Outline //
            icon={<IconShare />}
            onClick={options.buttonShare.onClick}
            circular
            size="large"
          />
        ) : null}
        {options.buttonCloseProject.visible ? (
          <div className={styles.ellipsis}>
            <Button.Outline
              icon={<IconThreeDots />}
              onClick={() => setCloseModalActive(!closeModalActive)}
              circular
              size="large"
            />
            {closeModalActive ? (
              <div className={styles.closeModal}>
                <Button.Outline
                  icon={<IconClose />}
                  size="large"
                  content="Close"
                  disabled={options.buttonCloseProject.disabled}
                  onClick={() => {
                    options.buttonCloseProject.onClick &&
                      options.buttonCloseProject.onClick();
                    setCloseModalActive(false);
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </Flex.Row>
    </div>
  );
}

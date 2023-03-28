import cx from "classnames";
import * as React from "react";

import { Options } from "../../types";

import IconShare from "./icons/IconShare";
import IconThreeDots from "./icons/IconThreeDots";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import DropdownMenu from "@/modules/teiki-ui/components/DropdownMenu";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  options: Options;
};

type Placement = "hidden" | "toolbar" | "dropdown-menu";

export default function Toolbar({ className, style, options }: Props) {
  const buttonBackProject$Placement: Placement = !options.buttonBackProject
    .visible
    ? "hidden"
    : options.buttonBackProject.priority
    ? "toolbar"
    : "dropdown-menu";

  const buttonUpdateProject$Placement: Placement = !options.buttonUpdateProject
    .visible
    ? "hidden"
    : options.buttonUpdateProject.priority
    ? "toolbar"
    : "dropdown-menu";

  const buttonPostUpdate$Placement: Placement = !options.buttonPostUpdate
    .visible
    ? "hidden"
    : options.buttonPostUpdate.priority
    ? "toolbar"
    : "dropdown-menu";

  const buttonCloseProject$Placement: Placement = !options.buttonCloseProject
    .visible
    ? "hidden"
    : options.buttonCloseProject.priority
    ? "toolbar"
    : "dropdown-menu";

  const buttonShare$Placement: Placement = !options.buttonShare.visible
    ? "hidden"
    : options.buttonShare.priority
    ? "toolbar"
    : "dropdown-menu";

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px">
        {buttonBackProject$Placement === "toolbar" ? (
          <Button.Solid
            content={
              options.buttonBackProject.isBacking
                ? "Stake More"
                : "Become a Fan"
            }
            onClick={options.buttonBackProject.onClick}
            color="primary"
            disabled={options.buttonBackProject.disabled}
          />
        ) : null}
        {buttonUpdateProject$Placement === "toolbar" ? (
          <Button.Solid
            content="Update"
            onClick={options.buttonUpdateProject.onClick}
            disabled={options.buttonUpdateProject.disabled}
          />
        ) : null}
        {buttonPostUpdate$Placement === "toolbar" ? (
          <Button.Solid
            content="Post"
            onClick={options.buttonPostUpdate.onClick}
            disabled={options.buttonPostUpdate.disabled}
            color="primary"
          />
        ) : null}
        {buttonCloseProject$Placement === "toolbar" ? (
          <Button.Solid
            content="Close"
            onClick={options.buttonCloseProject.onClick}
            disabled={options.buttonCloseProject.disabled}
          />
        ) : null}
        {buttonShare$Placement === "toolbar" ? (
          <Button.Outline
            icon={<IconShare />}
            circular
            onClick={options.buttonShare.onClick}
            disabled={options.buttonShare.disabled}
          />
        ) : null}
        {[
          buttonBackProject$Placement,
          buttonUpdateProject$Placement,
          buttonPostUpdate$Placement,
          buttonCloseProject$Placement,
          buttonShare$Placement,
        ].includes("dropdown-menu") ? (
          <DropdownMenu.Menu
            trigger={<Button.Outline icon={<IconThreeDots />} circular />}
          >
            {buttonBackProject$Placement === "dropdown-menu" ? (
              <DropdownMenu.Item
                content={
                  options.buttonBackProject.isBacking
                    ? "Stake More"
                    : "Become a Fan"
                }
                onSelect={options.buttonBackProject.onClick}
                disabled={options.buttonBackProject.disabled}
              />
            ) : null}
            {buttonUpdateProject$Placement === "dropdown-menu" ? (
              <DropdownMenu.Item
                content="Update"
                onSelect={options.buttonUpdateProject.onClick}
                disabled={options.buttonUpdateProject.disabled}
              />
            ) : null}
            {buttonPostUpdate$Placement === "dropdown-menu" ? (
              <DropdownMenu.Item
                content="Post"
                onSelect={options.buttonPostUpdate.onClick}
                disabled={options.buttonPostUpdate.disabled}
              />
            ) : null}
            {buttonCloseProject$Placement === "dropdown-menu" ? (
              <DropdownMenu.Item
                content="Close"
                onSelect={options.buttonCloseProject.onClick}
                disabled={options.buttonCloseProject.disabled}
              />
            ) : null}
            {buttonShare$Placement === "dropdown-menu" ? (
              <DropdownMenu.Item
                content="Share"
                onSelect={options.buttonShare.onClick}
                disabled={options.buttonShare.disabled}
              />
            ) : null}
          </DropdownMenu.Menu>
        ) : null}
      </Flex.Row>
    </div>
  );
}

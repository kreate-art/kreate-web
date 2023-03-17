import cx from "classnames";
import * as React from "react";

import GrammarlyWrapper from "../../../../../../components/GrammarlyWrapper";
import IconArrowDropDown from "../../../ProjectCommunityEditor/ProjectFAQEditor/components/Accordion/icons/IconArrowDropDown";
import {
  useField$MaximumMembers,
  useField$RequiredStake,
} from "../../hooks/useField";

import TierBanner from "./components/TierBanner";
import IconTrash from "./icons/IconTrash";
import styles from "./index.module.scss";

import {
  formatLovelaceAmount,
  parseLovelaceAmount,
} from "@/modules/bigint-utils";
import { ProjectBenefitsTier } from "@/modules/business-types";
import Resizable from "@/modules/teiki-components/components/Resizable";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";
import Button from "@/modules/teiki-ui/components/Button";
import Checkbox from "@/modules/teiki-ui/components/Checkbox";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Input from "@/modules/teiki-ui/components/Input";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectBenefitsTier;
  onChange: (newValue: ProjectBenefitsTier) => void;
  onDelete: () => void;
};

export default function TierInput({
  className,
  style,
  value,
  onChange,
  onDelete,
}: Props) {
  const [isOpened, setIsOpened] = React.useState(true);
  const [isLimited, setIsLimited] = React.useState(
    value.maximumMembers != null
  );
  const field$RequiredStake = useField$RequiredStake({
    initial: formatLovelaceAmount(value.requiredStake),
  });
  const field$MaximumMembers = useField$MaximumMembers({
    initial:
      value.maximumMembers != null ? value.maximumMembers.toString() : "",
  });

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row
        justifyContent="space-between"
        padding="18px 16px"
        alignItems="center"
        className={cx(styles.header, isOpened ? styles.open : null)}
      >
        <Typography.Div content={value.title} size="heading6" />
        <Flex.Row gap="8px" alignItems="center">
          <Button.Link content={<IconTrash />} onClick={onDelete} />
          <Button.Link
            content={<IconArrowDropDown />}
            onClick={() => setIsOpened(!isOpened)}
          />
        </Flex.Row>
      </Flex.Row>
      {isOpened && (
        <>
          <Divider.Horizontal />
          <Flex.Col
            padding="20px 16px 32px 16px"
            gap="24px"
            className={styles.detail}
          >
            <Input
              label="Tier name"
              value={value.title}
              onChange={(newTitle) =>
                onChange && onChange({ ...value, title: newTitle })
              }
            />
            <Flex.Col gap="12px">
              <Typography.Div content="Tier description" size="heading6" />
              <Resizable
                canResizeHeight
                style={{ width: "100%", minHeight: "100px" }}
              >
                <GrammarlyWrapper>
                  <RichTextEditor
                    value={value.contents?.body || EMPTY_JSON_CONTENT}
                    onChange={(newBody) => {
                      onChange &&
                        onChange({
                          ...value,
                          contents: { body: newBody },
                        });
                    }}
                    isBorderless={false}
                  />
                </GrammarlyWrapper>
              </Resizable>
            </Flex.Col>
            <TierBanner
              banner={value.banner}
              onBannerChange={(newBanner) => {
                onChange && onChange({ ...value, banner: newBanner });
              }}
            />
            <Input
              className={styles.input}
              value={field$RequiredStake.text}
              onChange={(newValue) => {
                field$RequiredStake.setText(newValue);
                onChange &&
                  onChange({
                    ...value,
                    requiredStake:
                      parseLovelaceAmount(
                        field$RequiredStake.normalize(newValue)
                      ) ?? 0,
                  });
              }}
              label="Staking from"
              rightSlot={
                <Flex.Row
                  justifyContent="center"
                  alignItems="center"
                  padding="0 12px 0 0"
                  className={styles.left}
                >
                  <Typography.H6 content="ADA" size="heading6" color="ink80" />
                </Flex.Row>
              }
            />
            <Flex.Col gap="12px">
              <Checkbox
                label="Limit the number of members"
                value={isLimited}
                onChange={() => {
                  field$MaximumMembers.setText(isLimited ? "" : "0");
                  onChange &&
                    onChange({
                      ...value,
                      maximumMembers: isLimited ? 0 : undefined,
                    });
                  setIsLimited(!isLimited);
                }}
              />
              {isLimited && (
                <Input
                  disabled={!isLimited}
                  value={field$MaximumMembers.text}
                  onChange={(newValue) => {
                    field$MaximumMembers.setText(newValue);
                    onChange &&
                      onChange({
                        ...value,
                        maximumMembers:
                          Number(field$MaximumMembers.normalize(newValue)) ?? 0,
                      });
                  }}
                />
              )}
            </Flex.Col>
          </Flex.Col>
        </>
      )}
    </div>
  );
}

const EMPTY_JSON_CONTENT = { type: "doc", content: [{ type: "paragraph" }] };

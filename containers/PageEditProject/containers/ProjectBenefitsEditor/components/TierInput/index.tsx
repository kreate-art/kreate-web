import cx from "classnames";
import * as React from "react";
import { arrayMove, List } from "react-movable";

import IconArrowDropDown from "../../../ProjectCommunityEditor/ProjectFAQEditor/components/Accordion/icons/IconArrowDropDown";
import { useField$RequiredStake } from "../../hooks/useField";
import IconPlusSquare from "../../icons/IconPlusSquare";

import TierBanner from "./components/TierBanner";
import TierBenefit from "./components/TierBenefit";
import IconDrag from "./icons/IconDrag";
import IconTrash from "./icons/IconTrash";
import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { ProjectBenefitsTier } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
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
  const field$RequiredStake = useField$RequiredStake({
    initial: formatLovelaceAmount(value.requiredStake),
  });

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row
        justifyContent="space-between"
        padding="18px 16px"
        className={cx(styles.header, isOpened ? styles.open : null)}
      >
        <Flex.Row gap="12px" alignItems="center">
          <IconDrag />
          <input
            className={styles.textInput}
            defaultValue={value.title}
            onChange={(event) =>
              onChange && onChange({ ...value, title: event.target.value })
            }
          />
        </Flex.Row>
        <Flex.Row gap="12px" alignItems="center">
          <Typography.Div
            size="bodySmall"
            content={formatTierCount(value.benefits.length)}
          />
          <button
            onClick={() => setIsOpened(!isOpened)}
            className={styles.icon}
          >
            <IconArrowDropDown />
          </button>
          <Button.Link content={<IconTrash />} onClick={onDelete} />
        </Flex.Row>
      </Flex.Row>
      {isOpened && (
        <>
          <Flex.Col
            padding="20px 16px 32px 16px"
            gap="16px"
            className={styles.detail}
          >
            <input
              className={cx(styles.textInput, styles.description)}
              defaultValue={value.description}
              onChange={(event) =>
                onChange &&
                onChange({ ...value, description: event.target.value })
              }
            />
            <TierBanner
              banner={value.banner}
              onBannerChange={(newBanner) =>
                onChange && onChange({ ...value, banner: newBanner })
              }
            />
            <Input
              className={styles.input}
              value={field$RequiredStake.text}
              onChange={(newValue) => {
                field$RequiredStake.setText(newValue);
                onChange &&
                  onChange({
                    ...value,
                    requiredStake: field$RequiredStake.parsed ?? 0,
                  });
              }}
              leftSlot={
                <Flex.Row
                  justifyContent="center"
                  alignItems="center"
                  padding="0 0 0 12px"
                  className={styles.left}
                >
                  <Typography.H6
                    content="Staking from:"
                    size="heading6"
                    color="ink80"
                  />
                </Flex.Row>
              }
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
            <Flex.Col className={styles.benefits}>
              <List
                values={value.benefits}
                onChange={({ oldIndex, newIndex }) => {
                  onChange &&
                    onChange({
                      ...value,
                      benefits: arrayMove(value.benefits, oldIndex, newIndex),
                    });
                }}
                renderList={({ children, props }) => (
                  <div {...props}>{children}</div>
                )}
                renderItem={({ value: benefit, index, props }) =>
                  index !== undefined && (
                    <div {...props}>
                      <TierBenefit
                        value={benefit}
                        onChange={(newBenefit) =>
                          onChange &&
                          onChange({
                            ...value,
                            benefits: value.benefits.map((item, id) =>
                              id === index ? newBenefit : item
                            ),
                          })
                        }
                        onDelete={() =>
                          onChange &&
                          onChange({
                            ...value,
                            benefits: value.benefits.filter(
                              (_, id) => index !== id
                            ),
                          })
                        }
                      />
                    </div>
                  )
                }
                container={document.getElementById("overlay-container")}
              />
              <Flex.Col padding="16px">
                <Button.Outline
                  content="Add Benefit"
                  icon={<IconPlusSquare />}
                  iconPosition="left"
                  size="small"
                  style={{ width: "fit-content" }}
                  onClick={() => {
                    onChange &&
                      onChange({
                        ...value,
                        benefits: [...value.benefits, "Benefit"],
                      });
                  }}
                />
              </Flex.Col>
            </Flex.Col>
          </Flex.Col>
        </>
      )}
    </div>
  );
}

function formatTierCount(count: number) {
  if (count === 0) return "No Benefits";
  if (count === 1) return "1 Benefit";
  return `${count} Benefits`;
}

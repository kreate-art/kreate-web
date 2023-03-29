import cx from "classnames";
import React from "react";

import IconClose from "../../../ModalMintKolour/icons/IconClose";

import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { calculateKolourFee } from "@/modules/kolours/fees";
import { Kolour } from "@/modules/kolours/types/Kolours";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolour[];
  onChange: (newValue: Kolour[]) => void;
};

export default function FreeKolourGrid({
  className,
  style,
  value,
  onChange,
}: Props) {
  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(containerElement);
  const numColumn = containerSize ? Math.ceil(containerSize.w / 300) : 1;
  return (
    <div
      className={cx(className, styles.container)}
      style={style}
      ref={setContainerElement}
    >
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${numColumn}, 1fr)` }}
      >
        {value.map((item, index) => {
          const originalFee = calculateKolourFee(item);
          return (
            <>
              <Flex.Col className={styles.card}>
                <Flex.Row
                  justifyContent="center"
                  padding="56px 68px"
                  style={{ backgroundColor: `#${item}`, color: "#fff" }}
                >
                  <Typography.Div
                    content={`#${item}`}
                    color="white"
                    size="heading6"
                  />
                </Flex.Row>
                <Flex.Row alignItems="center" gap="12px" padding="16px 24px">
                  <Typography.Span
                    content={formatLovelaceAmount(0, {
                      compact: true,
                      includeCurrencySymbol: true,
                    })}
                    size="heading6"
                  />
                  <Typography.Span
                    content={formatLovelaceAmount(originalFee, {
                      compact: true,
                      includeCurrencySymbol: true,
                    })}
                    size="bodySmall"
                    color="secondary50"
                    style={{ textDecoration: "line-through" }}
                  />
                </Flex.Row>
                <Button.Link
                  content={<IconClose />}
                  className={styles.close}
                  onClick={() =>
                    onChange &&
                    onChange(value.filter((_, idx) => index !== idx))
                  }
                />
              </Flex.Col>
            </>
          );
        })}
      </div>
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import NftCard from "../NftCard";

import IconSort from "./icons/IconSort";
import styles from "./index.module.scss";

import { sortedBy } from "@/modules/array-utils";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { Kolours } from "@/modules/kolours/types";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolours.GenesisKreationEntry[];
  onSelect?: (id: string) => void;
};

export default function NftCardGrid({
  className,
  style,
  value,
  onSelect,
}: Props) {
  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(containerElement);
  const numColumn = containerSize ? Math.ceil(containerSize.w / 400) : 1;

  const [sortIndex, setSortIndex] = React.useState<0 | 1 | 2>(0);
  /**
   * Current order of each sort index:
   * - true: descending
   * - false: ascending
   */
  const [sortOrders, setSortOrders] = React.useState({
    0: true,
    1: true,
    2: true,
  });
  const keyFunctions = {
    0: (nft: Kolours.GenesisKreationEntry) =>
      nft.palette.filter((item) => item.status !== "free").length /
      nft.palette.length,
    1: (nft: Kolours.GenesisKreationEntry) => nft.listedFee ?? 0,
    2: (nft: Kolours.GenesisKreationEntry) => nft.id,
  };
  const ascValue = sortedBy(value, keyFunctions[sortIndex]);
  const sortedValue = sortOrders[sortIndex] ? ascValue.reverse() : ascValue;

  return (
    <div
      className={cx(styles.container, className)}
      style={style}
      ref={setContainerElement}
    >
      <Flex.Row justifyContent="space-between" style={{ marginBottom: "16px" }}>
        <Flex.Row gap="8px" alignItems="center">
          <Typography.Span
            content={value.length}
            fontWeight="bold"
            size="heading4"
          />
          <Typography.Span
            content={`/ 99`}
            fontWeight="bold"
            size="heading6"
            color="secondary80"
          />
          <Typography.Span content="NFTs" size="heading5" />
        </Flex.Row>
        <Flex.Row gap="8px" alignItems="center">
          <Button
            variant={sortIndex === 0 ? "solid" : "outline"}
            content="Completion"
            size="small"
            onClick={() => {
              setSortOrders({
                ...sortOrders,
                0: sortIndex === 0 ? !sortOrders[0] : true,
              });
              setSortIndex(0);
            }}
            icon={<IconSort />}
            iconPosition="right"
          />
          <Button
            variant={sortIndex === 1 ? "solid" : "outline"}
            content="Price"
            size="small"
            onClick={() => {
              setSortOrders({
                ...sortOrders,
                1: sortIndex === 1 ? !sortOrders[1] : true,
              });
              setSortIndex(1);
            }}
            icon={<IconSort />}
            iconPosition="right"
          />
          <Button
            variant={sortIndex === 2 ? "solid" : "outline"}
            content="Added Date"
            size="small"
            onClick={() => {
              setSortOrders({
                ...sortOrders,
                2: sortIndex === 2 ? !sortOrders[2] : true,
              });
              setSortIndex(2);
            }}
            icon={<IconSort />}
            iconPosition="right"
          />
        </Flex.Row>
      </Flex.Row>
      <Divider$Horizontal$CustomDash style={{ marginBottom: "48px" }} />

      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${numColumn}, 1fr)` }}
      >
        {sortedValue.map((item) => (
          <NftCard
            key={item.id}
            value={item}
            onClick={() => onSelect && onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

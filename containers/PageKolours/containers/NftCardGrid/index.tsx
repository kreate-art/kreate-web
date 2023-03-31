import cx from "classnames";
import * as React from "react";

import NftCard from "../NftCard";

import IconSort from "./icons/IconSort";
import styles from "./index.module.scss";

import { sortedBy } from "@/modules/array-utils";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import { Kolours } from "@/modules/kolours/types";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import RadioGroup$AsButton from "@/modules/teiki-ui/components/RadioGroup$AsButton";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolours.GenesisKreation$Mint[];
  onSelect?: (id: string) => void;
};

type SortOption = "completion" | "price" | "addedDate";

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

  const [sortOption, setSortOption] = React.useState<SortOption>("completion");
  /**
   * Current order of each sort index:
   * - true: descending
   * - false: ascending
   */
  const [sortOrders, setSortOrders] = React.useState({
    completion: true,
    price: true,
    addedDate: true,
  });
  const keyFunctions = {
    completion: (nft: Kolours.GenesisKreation$Mint) =>
      nft.palette.filter((item) => item.status !== "free").length /
      nft.palette.length,
    price: (nft: Kolours.GenesisKreation$Mint) => nft.fee ?? 0,
    addedDate: (nft: Kolours.GenesisKreation$Mint) => nft.id,
  };
  const ascValue = sortedBy(value, keyFunctions[sortOption]);
  const sortedValue = sortOrders[sortOption] ? ascValue.reverse() : ascValue;

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
            content={`/ only 99`}
            fontWeight="bold"
            size="heading6"
            color="secondary80"
          />
          <Typography.Span content="Genesis Kreations" size="heading5" />
        </Flex.Row>
        <Flex.Row gap="8px" alignItems="center">
          <RadioGroup$AsButton<SortOption>
            value={sortOption}
            options={[
              {
                value: "completion",
                label: "Completion",
                icon: <IconSort />,
              },
              { value: "price", label: "Price", icon: <IconSort /> },
              {
                value: "addedDate",
                label: "Added Date",
                icon: <IconSort />,
              },
            ]}
            onChange={(value) => {
              setSortOrders({
                ...sortOrders,
                [value]: sortOption === value ? !sortOrders[value] : true,
              });
              setSortOption(value);
            }}
            size="small"
            color="secondary"
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

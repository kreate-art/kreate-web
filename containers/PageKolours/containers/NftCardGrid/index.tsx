import cx from "classnames";
import * as React from "react";

import { Nft } from "../../kolours-types";
import NftCard from "../NftCard";

import styles from "./index.module.scss";

import { sortedBy } from "@/modules/array-utils";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Nft[];
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
  const numColumn = containerSize ? Math.ceil(containerSize.w / 600) : 1;

  const [sortIndex, setSortIndex] = React.useState(0);
  const sortedValue =
    sortIndex === 0
      ? sortedBy(
          value,
          (nft) =>
            -nft.palette.filter((item) => item.status !== "free").length /
            nft.palette.length
        )
      : value;

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
          <Typography.Span content="NFTs" size="heading5" />
        </Flex.Row>
        <Flex.Row gap="8px" alignItems="center">
          <Button.Solid
            content="Completion"
            size="small"
            onClick={() => setSortIndex(0)}
          />
          <Button.Outline content="Latest" size="small" disabled={true} />
          <Button.Outline content="Oldest" size="small" disabled={true} />
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
            onClick={() => {
              onSelect && onSelect(item.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

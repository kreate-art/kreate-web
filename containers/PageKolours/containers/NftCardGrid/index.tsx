import cx from "classnames";
import * as React from "react";

import { Nft } from "../../kolours-types";
import NftCard from "../NftCard";

import styles from "./index.module.scss";

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
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.grid}>
        {value.map((item) => (
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

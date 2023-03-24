import cx from "classnames";
import * as React from "react";

import KolourCard from "../KolourCard";

import styles from "./index.module.scss";

import { Kolours } from "@/modules/kolours/types";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolours.MintedKolourEntry[] | undefined;
  error: unknown;
};

export default function KolourList({ className, style, value, error }: Props) {
  if (error) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        <MessageBox description="Error" />
      </div>
    );
  }

  if (!value) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        <MessageBox description="Loading..." />
      </div>
    );
  }

  if (value && !value.length) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        <MessageBox description="No Kolour NFTs minted" />
      </div>
    );
  }

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.grid}>
        {value.map((item, index) => (
          <KolourCard key={index} value={item} />
        ))}
      </div>
    </div>
  );
}

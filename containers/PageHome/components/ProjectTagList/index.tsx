import cx from "classnames";
import { CSSProperties } from "react";

import styles from "./index.module.scss";

import Chip from "@/modules/teiki-ui/components/Chip";

type Props = {
  className?: string;
  style?: CSSProperties;
  value: string[];
  inverted?: boolean;
};

export default function ProjectTagList({
  className,
  style,
  value,
  inverted,
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        className,
        inverted ? styles.inverted : null
      )}
      style={style}
    >
      <div className={styles.data}>
        {value.length ? (
          value.map((item) => (
            <Chip content={item} key={item} className={styles.tag} />
          ))
        ) : (
          <span className={styles.noTags}>no tags</span>
        )}
      </div>
    </div>
  );
}

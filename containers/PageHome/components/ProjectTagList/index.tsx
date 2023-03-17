import cx from "classnames";
import Link from "next/link";
import { CSSProperties } from "react";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

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
      <Typography.Span
        style={{ flex: "0 0 auto" }}
        color="ink80"
        content="Tags: "
        size="bodyExtraSmall"
        fontWeight="semibold"
      />
      <div className={styles.data}>
        {value.length ? (
          value.map((tag, index) => (
            <>
              <Link
                style={{ display: "flex", color: "unset" }}
                key={index}
                href={`/search?${new URLSearchParams({ tag })}`}
              >
                <Typography.Span
                  content={"#" + tag}
                  size="bodyExtraSmall"
                  fontWeight="semibold"
                  color="ink"
                />
              </Link>
              {index !== value.length - 1 && (
                <span style={{ color: "rgba(34, 34, 34, 0.5)" }}>/</span>
              )}
            </>
          ))
        ) : (
          <span className={styles.noTags}>no tags</span>
        )}
      </div>
    </div>
  );
}

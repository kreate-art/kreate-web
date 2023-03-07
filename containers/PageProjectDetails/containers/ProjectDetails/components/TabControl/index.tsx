import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: number;
  onChange: (newValue: number, hash: string) => void;
  numOfPosts: number;
};

export default function TabControl({
  className,
  style,
  value,
  onChange,
  numOfPosts,
}: Props) {
  return (
    <div style={style} className={cx(styles.container, className)}>
      <button
        className={styles.tab}
        onClick={() => onChange(0, "#about")}
        id="about"
      >
        <div
          className={cx(styles.tabContent, value === 0 ? styles.active : null)}
        >
          About
        </div>
        <hr
          className={cx(
            styles.underline,
            value === 0 ? styles.active : undefined
          )}
        />
      </button>
      <button
        className={styles.tab}
        onClick={() => onChange(1, "#benefits")}
        id="benefits"
      >
        <div
          className={cx(styles.tabContent, value === 1 ? styles.active : null)}
        >
          Benefits
        </div>
        <hr
          className={cx(
            styles.underline,
            value === 1 ? styles.active : undefined
          )}
        />
      </button>
      <button
        className={styles.tab}
        onClick={() => onChange(2, "#posts")}
        id="posts"
      >
        <div
          className={cx(styles.tabContent, value === 2 ? styles.active : null)}
        >
          <span>Posts</span>
          <Typography.Span
            size="bodyExtraSmall"
            fontWeight="semibold"
            color="green"
            className={styles.numOfAnnouncements}
          >
            {numOfPosts}
          </Typography.Span>
        </div>
        <hr
          className={cx(
            styles.underline,
            value === 2 ? styles.active : undefined
          )}
        />
      </button>
      <button
        className={styles.tab}
        onClick={() => onChange(3, "#faqs")}
        id="faqs"
      >
        <div
          className={cx(styles.tabContent, value === 3 ? styles.active : null)}
        >
          FAQs
        </div>
        <hr
          className={cx(
            styles.underline,
            value === 3 ? styles.active : undefined
          )}
        />
      </button>
      <button
        className={styles.tab}
        onClick={() => onChange(4, "#activities")}
        id="activities"
      >
        <div
          className={cx(styles.tabContent, value === 4 ? styles.active : null)}
        >
          Activities
        </div>
        <hr
          className={cx(
            styles.underline,
            value === 4 ? styles.active : undefined
          )}
        />
      </button>
    </div>
  );
}

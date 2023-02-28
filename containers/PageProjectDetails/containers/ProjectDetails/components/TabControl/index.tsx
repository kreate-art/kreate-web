import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Tab = {
  title: React.ReactNode;
  hash: string;
  disabled?: boolean;
};

type Props = {
  className?: string;
  tabs: Tab[];
  value: number;
  onChange: (newValue: number) => void;
};

export default function TabControl({
  className,
  tabs,
  value,
  onChange,
}: Props) {
  return (
    <div className={cx(styles.container, className)}>
      {tabs.map((tab, index) => (
        <button
          className={styles.tab}
          onClick={() => onChange(index)}
          key={index}
          disabled={tab.disabled}
          title={tab.disabled ? "Coming Soon" : ""}
          id={tab.hash.substring(1)}
        >
          <div
            className={cx(
              styles.tabContent,
              value === index ? styles.active : undefined,
              tab.disabled ? styles.disabled : undefined
            )}
          >
            {tab.title}
          </div>
          <hr
            className={cx(
              styles.underline,
              value === index ? styles.active : undefined
            )}
          />
        </button>
      ))}
    </div>
  );
}

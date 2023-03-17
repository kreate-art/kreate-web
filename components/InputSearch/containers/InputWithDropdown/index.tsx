import cx from "classnames";
import React from "react";

import IconSearch from "./assets/IconSearch";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  active: boolean;
  dropdownItems?: {
    content: React.ReactNode;
    onClick?: () => void;
  }[];
  onActive?: () => void;
  onBlur?: () => void;
  onChange?: (content: string) => void;
  onSubmit?: () => void;
};

export default function InputWithDropdown({
  className,
  style,
  active,
  value,
  dropdownItems,
  onActive,
  onBlur,
  onChange,
  onSubmit,
}: Props) {
  return (
    <>
      <div className={cx(styles.container, className)} style={style}>
        <div style={{ position: "relative", height: "48px" }}>
          <div
            className={
              active
                ? styles.inputContainerActive
                : styles.inputContainerInactive
            }
            onClick={() => {
              onActive && onActive();
            }}
          >
            <IconSearch
              className={
                active ? styles.searchIconActive : styles.searchIconInactive
              }
            />
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit && onSubmit();
              }}
              style={{ width: "100%" }}
            >
              <input
                onChange={(event) => {
                  onChange && onChange(event.target.value);
                }}
                value={value}
                placeholder="Search"
                className={cx(
                  styles.input,
                  active ? styles.inputActive : styles.inputInactive
                )}
              />
            </form>
          </div>
        </div>
        {active && dropdownItems ? (
          <div className={styles.dropdown}>
            <div className={styles.dropdownContainer}>
              {dropdownItems.map((dropdownItem) => dropdownItem.content)}
            </div>
          </div>
        ) : null}
      </div>
      {active ? (
        <div
          onClick={() => {
            onBlur && onBlur();
          }}
          className={styles.blurLayer}
        ></div>
      ) : null}
    </>
  );
}

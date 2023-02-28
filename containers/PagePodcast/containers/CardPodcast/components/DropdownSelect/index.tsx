import cx from "classnames";
import React from "react";

import IconSearch from "../../../../../../components/InputSearch/containers/InputWithDropdown/assets/IconSearch";
import IconCaretDown from "../../icons/IconCaretDown";
import IconCaretUp from "../../icons/IconCaretUp";

import styles from "./index.module.scss";

import Checkbox from "@/modules/teiki-ui/components/Checkbox";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  active: boolean;
  label: string;
  items: string[];
  selectedItems: string[];
  tagPrefix: string;
  onSelectedItemsChange?: (items: string[]) => void;
  onReset?: () => void;
  onClick?: () => void;
  onTagPrefixChange?: (newTagPrefix: string) => void;
};

export default function DropdownSelect({
  active,
  label,
  items,
  selectedItems,
  tagPrefix,
  onSelectedItemsChange,
  onClick,
  onTagPrefixChange,
}: Props) {
  return (
    <>
      <div className={styles.container}>
        <button
          className={cx(
            styles.buttonDropdown,
            active ? styles.buttonActive : styles.buttonInactive
          )}
          onClick={() => onClick && onClick()}
        >
          <span className={styles.buttonDropdownLabel}>{label}</span>
          {active ? <IconCaretUp /> : <IconCaretDown />}
        </button>
        {!active ? null : (
          <>
            <div className={styles.selectContainer}>
              <div className={styles.inputSearch}>
                <IconSearch className={styles.searchIcon} />
                <input
                  onChange={(event) =>
                    onTagPrefixChange && onTagPrefixChange(event.target.value)
                  }
                  value={tagPrefix}
                  placeholder="Search"
                  className={styles.input}
                />
              </div>
              <div className={styles.itemGroup}>
                {items
                  .filter((item) =>
                    item.toLowerCase().startsWith(tagPrefix.toLowerCase())
                  )
                  .map((item, index) => (
                    // TODO: The tick is black initially but turns
                    // green after clicking on anything
                    <Checkbox
                      key={index}
                      value={selectedItems.includes(item)}
                      onChange={() => {
                        const newSelectedItems = selectedItems.includes(item)
                          ? selectedItems.filter((tag) => tag !== item)
                          : [...selectedItems, item];
                        onSelectedItemsChange &&
                          onSelectedItemsChange(newSelectedItems);
                      }}
                      className={styles.checkbox}
                      label={
                        <Title size="h6" className={styles.item} maxLines={2}>
                          {item}
                        </Title>
                      }
                    />
                  ))}
              </div>
            </div>
            <div
              className={styles.overlay}
              onClick={() => onClick && onClick()}
            />
          </>
        )}
      </div>
    </>
  );
}

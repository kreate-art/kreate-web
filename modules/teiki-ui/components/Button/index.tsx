import cx from "classnames";
import * as React from "react";

import Link from "./components/Link";
import Outline from "./components/Outline";
import Solid from "./components/Solid";
import styles from "./index.module.scss";

export type StrictButtonProps = {
  // Style overrides
  className?: string;
  style?: React.CSSProperties;

  // Content
  content?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;

  // Size
  size?: "small" | "medium" | "large";

  // Variant (fill, stroke)
  variant?: "solid" | "outline" | "transparent";

  // Others
  iconPosition?: "left" | "right";
};

type ButtonProps = StrictButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/** @deprecated use Button.Solid or Button.Outline instead */
function Button({
  className,
  style,
  content,
  children,
  icon,
  size,
  variant,
  iconPosition = "left",
  ...others
}: ButtonProps) {
  const displayedContent = children || content;
  return (
    <button
      className={cx(
        className,
        styles.button,
        size === "large"
          ? styles.sizeLarge
          : size === "medium"
          ? styles.sizeMedium
          : size === "small"
          ? styles.sizeSmall
          : styles.sizeMedium,
        variant === "solid"
          ? styles.variantSolid
          : variant === "outline"
          ? styles.variantOutline
          : variant === "transparent"
          ? styles.variantTransparent
          : styles.variantSolid
      )}
      type="button"
      style={style}
      {...others}
    >
      {icon != null && iconPosition === "left" ? (
        <div className={styles.iconContainer}>{icon}</div>
      ) : null}
      {displayedContent != null ? (
        <div className={styles.displayedContentContainer}>
          {displayedContent}
        </div>
      ) : null}
      {icon != null && iconPosition === "right" ? (
        <div className={styles.iconContainer}>{icon}</div>
      ) : null}
    </button>
  );
}

export default Object.assign(Button, { Link, Outline, Solid });

import cx from "classnames";
import * as React from "react";

import { DEFAULT_LOGO_IMAGE } from "./constants";
import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";
import ImageView from "@/modules/teiki-components/components/ImageView";

const SIZE_TO_CLASS_NAME = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
};

const SHADOW_TO_CLASS_NAME = {
  shadow: styles.shadowShadow,
  none: "",
};

const BORDER_TO_CLASS_NAME = {
  medium: styles.borderMedium,
  none: "",
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectImage | null | undefined;
  size?: keyof typeof SIZE_TO_CLASS_NAME;
  shadow?: keyof typeof SHADOW_TO_CLASS_NAME;
  border?: keyof typeof BORDER_TO_CLASS_NAME;
};

export default function LogoImageViewer({
  className,
  style,
  value,
  size = "medium",
  shadow = "none",
  border = "none",
}: Props) {
  const actualValue = value || DEFAULT_LOGO_IMAGE;
  return (
    <div
      className={cx(
        styles.container,
        className,
        SIZE_TO_CLASS_NAME[size],
        SHADOW_TO_CLASS_NAME[shadow],
        BORDER_TO_CLASS_NAME[border]
      )}
      style={style}
    >
      <ImageView
        className={styles.image}
        src={actualValue.url}
        crop={{
          x: actualValue.x,
          y: actualValue.y,
          w: actualValue.width,
          h: actualValue.height,
        }}
      />
    </div>
  );
}

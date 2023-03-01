import cx from "classnames";
import * as React from "react";

import { DEFAULT_LOGO_IMAGE } from "./constants";
import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";
import ImageView from "@/modules/teiki-components/components/ImageView";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectImage | null | undefined;
};

/**
 * Displays a 64x64 logo image, with border and shadow
 */
export default function LogoImageView({ className, style, value }: Props) {
  const actualValue = value || DEFAULT_LOGO_IMAGE;
  return (
    <div className={cx(styles.container, className)} style={style}>
      <ImageView
        className={styles.image}
        src={actualValue.url}
        crop={actualValue.crop}
      />
    </div>
  );
}

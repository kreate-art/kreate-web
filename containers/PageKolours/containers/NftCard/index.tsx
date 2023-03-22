import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import { Nft } from "../../kolours-types";

import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Nft;
  onClick?: () => void;
};

// TODO: @sk-kitsune: implement this component properly
export default function NftCard({ className, style, value, onClick }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <button onClick={onClick} className={styles.button}>
        <WithAspectRatio aspectRatio={2 / 1}>
          <ImageView
            style={{ width: "100%", height: "100%" }}
            src={value.grayscaleImage.src}
            crop={{ x: 0, y: 0, w: 1, h: 1 }}
          />
        </WithAspectRatio>
      </button>
    </div>
  );
}

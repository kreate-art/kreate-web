import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import { Nft } from "../../kolours-types";

import CompleteIndicator from "./components/CompleteIndicator";
import PaletteBar from "./components/PaletteBar";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import Flex from "@/modules/teiki-ui/components/Flex";

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
      <div className={styles.box} onClick={onClick}>
        <WithAspectRatio aspectRatio={5 / 3}>
          <ImageView
            style={{ width: "100%", height: "100%" }}
            src={value.grayscaleImage.src}
            crop={{ x: 0, y: 0, w: 1, h: 1 }}
          />
        </WithAspectRatio>
        <Flex.Row justifyContent="center" className={styles.wrap}>
          <PaletteBar value={value.palette} className={styles.bar} />
        </Flex.Row>
        <CompleteIndicator value={value.palette} className={styles.indicator} />
      </div>
    </div>
  );
}

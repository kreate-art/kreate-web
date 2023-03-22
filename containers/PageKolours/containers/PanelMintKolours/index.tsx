import cx from "classnames";
import Image$Next from "next/image";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import { Image, PaletteItem } from "../../kolours-types";

import PaletteCell from "./components/PaletteCell";
import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  grayscaleImage: Image;
  palette: PaletteItem[];
};

export default function PanelMintKolours({
  className,
  style,
  grayscaleImage,
  palette,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row flexWrap="wrap" padding="24px" gap="32px" alignItems="stretch">
        <Flex.Cell flex="1 1 300px">
          <WithAspectRatio aspectRatio={1}>
            <Image$Next src={grayscaleImage.src} alt="" fill />
          </WithAspectRatio>
        </Flex.Cell>
        <Flex.Cell flex="1 1 300px">
          <div className={styles.grid}>
            {palette.map((item, index) => (
              <PaletteCell
                key={index}
                color={item.color}
                minted={item.minted}
                checked={false}
                fill
              />
            ))}
          </div>
        </Flex.Cell>
      </Flex.Row>
    </div>
  );
}

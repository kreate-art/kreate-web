import cx from "classnames";
import * as React from "react";

import { Image, PaletteItem } from "../../kolours-types";

import Palette from "./components/Palette";
import Viewer from "./components/Viewer";
import styles from "./index.module.scss";
import { Selection } from "./types";

import { range } from "@/modules/array-utils";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  grayscaleImage: Image | undefined;
  palette: PaletteItem[] | undefined;
};

export default function PanelMint({
  className,
  style,
  grayscaleImage,
  palette,
}: Props) {
  const [selection, setSelection] = React.useState<Selection>({});
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="16px" paddingBottom="32px">
        <Viewer
          grayscaleImage={grayscaleImage}
          palette={palette}
          selectedIndexes={
            palette
              ? range(palette.length).filter(
                  (index) => palette[index].minted || !!selection[index]
                )
              : undefined
          }
        />
        <Palette
          palette={palette}
          selection={selection}
          onSelectionChange={setSelection}
        />
        <Divider$Horizontal$CustomDash />
        <Flex.Row justifyContent="center">
          <Button.Solid content="Mint" />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}

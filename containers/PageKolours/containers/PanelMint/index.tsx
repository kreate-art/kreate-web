import cx from "classnames";
import * as React from "react";

import { Image, PaletteItem } from "../../kolours-types";

import Palette from "./components/Palette";
import Viewer from "./components/Viewer";
import styles from "./index.module.scss";
import { Selection } from "./types";

import Button from "@/modules/teiki-ui/components/Button";
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
      <Flex.Col gap="16px">
        <Viewer
          grayscaleImage={grayscaleImage}
          palette={palette}
          selection={selection}
        />
        <Palette
          palette={palette}
          selection={selection}
          onSelectionChange={setSelection}
        />
        <Flex.Row justifyContent="center">
          <Button.Solid content="Mint" />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}

import cx from "classnames";
import * as React from "react";

import Palette from "./components/Palette";
import Viewer from "./components/Viewer";
import styles from "./index.module.scss";
import { Selection } from "./types";

import { range } from "@/modules/array-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { Kolours } from "@/modules/kolours/types";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  initialImage: Kolours.Image | undefined;
  palette: Kolours.Layer[] | undefined;
  fee: LovelaceAmount | undefined;
  listedFee: LovelaceAmount | undefined;
};

export default function PanelMint({
  className,
  style,
  initialImage,
  palette,
  fee,
  listedFee,
}: Props) {
  const [selection, setSelection] = React.useState<Selection>({});
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="16px" paddingBottom="32px">
        <Viewer
          className={styles.viewer}
          initialImage={initialImage}
          palette={palette}
          selectedIndexes={
            palette
              ? range(palette.length).filter(
                  (index) =>
                    palette[index].status !== "free" || !!selection[index]
                )
              : undefined
          }
          fee={fee}
          listedFee={listedFee}
        />
        <Palette
          className={styles.palette}
          palette={palette}
          selection={selection}
          onSelectionChange={setSelection}
        />
        <Divider$Horizontal$CustomDash />
        <Flex.Row justifyContent="center">
          <Button.Solid content="Mint" disabled />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}

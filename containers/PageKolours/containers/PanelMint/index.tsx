import cx from "classnames";
import * as React from "react";

import Palette from "./components/Palette";
import Viewer from "./components/Viewer";
import IconChevronLeft from "./icons/IconChevronLeft";
import IconChevronRight from "./icons/IconChevronRight";
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
  finalImage: Kolours.Image | undefined;
  palette: Kolours.Layer[] | undefined;
  fee: LovelaceAmount | undefined;
  listedFee: LovelaceAmount | undefined;
  canGoPrev?: boolean;
  onGoPrev?: () => void;
  canGoNext?: boolean;
  onGoNext?: () => void;
};

export default function PanelMint({
  className,
  style,
  initialImage,
  finalImage,
  palette,
  fee,
  listedFee,
  canGoPrev,
  onGoPrev,
  canGoNext,
  onGoNext,
}: Props) {
  const [selection, setSelection] = React.useState<Selection>({});
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="16px" paddingBottom="32px">
        <div className={styles.viewerContainer}>
          <Viewer
            initialImage={initialImage}
            finalImage={finalImage}
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
          {canGoPrev ? (
            <button
              className={cx(styles.buttonNavigate, styles.buttonNavigateLeft)}
              onClick={onGoPrev}
            >
              <IconChevronLeft />
            </button>
          ) : null}
          {canGoNext ? (
            <button
              className={cx(styles.buttonNavigate, styles.buttonNavigateRight)}
              onClick={onGoNext}
            >
              <IconChevronRight />
            </button>
          ) : null}
        </div>
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

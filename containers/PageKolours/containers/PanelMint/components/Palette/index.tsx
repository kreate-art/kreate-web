import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../../../components/WithAspectRatio";
import { PaletteItem } from "../../../../kolours-types";
import PaletteCell from "../PaletteCell";

import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";

type IndexOf<_T> = number;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  palette: PaletteItem[] | undefined;
  selection: Record<IndexOf<PaletteItem>, boolean>;
  onSelectionChange: (selection: Record<IndexOf<PaletteItem>, boolean>) => void;
};

export default function Palette({
  className,
  style,
  palette,
  selection,
  onSelectionChange,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row alignItems="center" justifyContent="center" flexWrap="wrap">
        {palette
          ? palette.map((item, index) => (
              <Flex.Cell key={index} flex="0 1 128px">
                <WithAspectRatio aspectRatio={1 / 1}>
                  <PaletteCell
                    fill
                    paletteItem={item}
                    checked={!!selection[index]}
                    onCheckedChange={() =>
                      onSelectionChange({
                        ...selection,
                        [index]: !selection[index],
                      })
                    }
                  />
                </WithAspectRatio>
              </Flex.Cell>
            ))
          : null}
      </Flex.Row>
    </div>
  );
}

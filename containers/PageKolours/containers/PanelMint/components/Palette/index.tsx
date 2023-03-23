import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../../../components/WithAspectRatio";
import { Selection } from "../../types";
import PaletteCell from "../PaletteCell";

import styles from "./index.module.scss";

import { Kolours } from "@/modules/kolours/types";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  palette: Kolours.Layer[] | undefined;
  selection: Selection;
  onSelectionChange: (selection: Selection) => void;
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
              <Flex.Cell key={index} flex="1 1 100px" maxWidth="120px">
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

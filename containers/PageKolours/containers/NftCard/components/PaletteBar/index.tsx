import cx from "classnames";

import { PaletteItem } from "../../../../kolours-types";
import { toHexColor } from "../../../../utils";

import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: PaletteItem[];
};

export default function PaletteBar({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row className={styles.box}>
        {value.map(({ kolour }, index) => (
          <div
            key={index}
            className={styles.item}
            style={{ backgroundColor: toHexColor(kolour) }}
          />
        ))}
      </Flex.Row>
    </div>
  );
}

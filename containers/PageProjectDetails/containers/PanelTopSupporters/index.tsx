import cx from "classnames";

import styles from "./index.module.scss";

import { SupporterInfo } from "@/modules/business-types";
import TableTopSupporters from "@/modules/teiki-components/components/TableTopSupporters";

type Props = {
  className?: string;
  value: SupporterInfo[];
};

export default function PanelTopSupporters({ className, value }: Props) {
  return (
    <div className={cx(className, styles.container)}>
      <h6 className={styles.label}>Top Backers</h6>
      <TableTopSupporters value={value} />
    </div>
  );
}

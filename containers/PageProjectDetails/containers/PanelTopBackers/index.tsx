import cx from "classnames";

import styles from "./index.module.scss";

import { SupporterInfo } from "@/modules/business-types";
import TableTopSupporters from "@/modules/teiki-components/components/TableTopSupporters";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  value: SupporterInfo[];
};

export default function PanelTopBackers({ className, value }: Props) {
  return (
    <div className={cx(className, styles.container)}>
      <Flex.Col gap="24px">
        <Typography.Div size="heading6" color="ink" content="Top Backers" />
        <TableTopSupporters value={value} />
      </Flex.Col>
    </div>
  );
}

import cx from "classnames";

import IconDrag from "../../icons/IconDrag";
import IconTrash from "../../icons/IconTrash";

import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  onChange: (newValue: string) => void;
  onDelete: () => void;
};

export default function TierBenefit({
  className,
  style,
  value,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className={cx(className, styles.container)} style={style}>
      <Flex.Row
        padding="20px 16px 20px 24px"
        justifyContent="space-between"
        gap="12px"
        alignItems="center"
      >
        <IconDrag />
        <input
          className={styles.textInput}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button.Link content={<IconTrash />} onClick={onDelete} />
      </Flex.Row>
      <Divider.Horizontal />
    </div>
  );
}

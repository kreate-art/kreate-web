import cx from "classnames";

import IconDrag from "../../icons/IconDrag";
import IconTrash from "../../icons/IconTrash";

import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Input from "@/modules/teiki-ui/components/Input";

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
        padding="16px 16px 0 16px"
        justifyContent="space-between"
        gap="16px"
        alignItems="center"
      >
        <IconDrag />
        <Input
          value={value}
          onChange={(newValue) => onChange(newValue)}
          style={{ width: "100%" }}
        />
        <Button.Link content={<IconTrash />} onClick={onDelete} />
      </Flex.Row>
    </div>
  );
}

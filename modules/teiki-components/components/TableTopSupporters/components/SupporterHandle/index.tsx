import styles from "./index.module.scss";

import useAdaHandle from "@/modules/common-hooks/hooks/useAdaHandle";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  address: string;
};

export default function SupporterHandle({ address }: Props) {
  const { data, error } = useAdaHandle(address);
  if (error != null || data == undefined) {
    return (
      <Typography.Div
        size="heading6"
        className={styles.columnAddress}
        maxLines={1}
      >
        <InlineAddress.Auto
          value={address}
          className={styles.inlineAddressAuto}
        />
      </Typography.Div>
    );
  }
  return (
    <Typography.Div
      size="heading6"
      className={styles.columnAddress}
      maxLines={1}
      content={`$${data}`}
    />
  );
}

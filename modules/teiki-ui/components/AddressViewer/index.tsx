import cx from "classnames";
import useSWR from "swr";

import InlineAddress from "../InlineAddress";

import styles from "./index.module.scss";

import { getAdaHandle } from "@/modules/ada-handle/utils";

type Props = {
  value: string;
  className?: string;
  style?: React.CSSProperties;
};

/**NOTE: @sk-tenba: should handle the max width carefully */
export default function AddressViewer({ className, style, value }: Props) {
  const { data: handle, error } = useSWR(
    ["c2b75c1b-8c7a-4124-ac76-909b2a943a4f", value],
    async () => {
      return await getAdaHandle(value);
    }
  );
  const hasAdaHandle = handle && handle !== value && error == null;
  return (
    <div className={cx(className, styles.container)} style={style}>
      {hasAdaHandle ? (
        <span>{handle}</span>
      ) : (
        <InlineAddress value={value} length="short" />
      )}
    </div>
  );
}

import cx from "classnames";

import ImageCropped from "../../../../components/ImageCropped";

import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";

type Props = {
  coverImages?: ProjectImage[];
  className?: string;
};

export default function Backdrop({ className, coverImages }: Props) {
  const actualCoverImage = coverImages ? coverImages[0] : undefined;
  return (
    <div className={cx(className, styles.container)}>
      {!actualCoverImage ? null : (
        <ImageCropped
          className={styles.coverImage}
          src={actualCoverImage.url}
          crop={{
            x: 0,
            y: 0,
            w: 1,
            h: 1,
          }}
        />
      )}
    </div>
  );
}

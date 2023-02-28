import cx from "classnames";

import ImageCropped from "../../../../components/ImageCropped";
import { DEFAULT_PROJECT_IMAGE } from "../../../PageHome/components/ProjectImageCropped/constants";

import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";

type Props = {
  coverImages?: ProjectImage[];
  className?: string;
};

export default function Backdrop({ className, coverImages }: Props) {
  const actualCoverImage =
    coverImages != null && coverImages.length > 0
      ? coverImages[0]
      : DEFAULT_PROJECT_IMAGE;
  return (
    <div className={cx(className, styles.container)}>
      <ImageCropped
        className={styles.coverImage}
        src={actualCoverImage.url}
        crop={{
          x: actualCoverImage.x,
          y: actualCoverImage.y,
          w: actualCoverImage.width,
          h: actualCoverImage.height,
        }}
      />
    </div>
  );
}

import ImageCropped from "../../../../../../../../components/ImageCropped";

import IconClose from "./icons/IconClose";
import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";

type Props = {
  image: ProjectImage;
  onClick: () => void;
  onClose: () => void;
};

export default function ItemImageCropped({ image, onClick, onClose }: Props) {
  return (
    <div className={styles.imageItemWrapper}>
      <div className={styles.imageItem} onClick={() => onClick && onClick()}>
        <ImageCropped
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "12px",
          }}
          src={image.url}
          crop={image.crop}
        />
      </div>
      <button
        className={styles.closeImageButton}
        onClick={(event) => {
          event.preventDefault();
          onClose && onClose();
        }}
      >
        <IconClose />
      </button>
    </div>
  );
}

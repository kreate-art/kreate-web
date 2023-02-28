import * as React from "react";
import { Carousel } from "react-responsive-carousel";

import ImageCropped from "../../../../../../components/ImageCropped";
import { ProjectImage } from "../../../../../../modules/business-types";
import IconEdit from "../../icons/IconEdit";
import commonStyles from "../../index.module.scss";
import ModalEditImage from "../ModalEditImage";

import styles from "./index.module.scss";

import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  images: ProjectImage[];
  suggestions: ProjectImage[];
  onImagesChange: (newImages: ProjectImage[]) => void;
};

export default function ProjectCoverImages({
  images,
  suggestions,
  onImagesChange,
}: Props) {
  const { showModal } = useModalPromises();
  const ref = React.useRef<Carousel>(null);
  return (
    <div className={styles.basicCover}>
      {images.length > 0 ? (
        <>
          <div className={commonStyles.basicTitleWrapper}>
            <Title content="Banners" />
            <Button.Solid
              className={commonStyles.basicEditButton}
              icon={<IconEdit className={commonStyles.basicIcon} />}
              content="Edit"
              onClick={() =>
                showModal<void>((resolve) => {
                  return (
                    <ModalEditImage
                      images={images}
                      suggestedImages={suggestions}
                      onChange={(newImages) => {
                        onImagesChange && onImagesChange(newImages);
                        ref.current?.moveTo(0);
                      }}
                      close={resolve}
                    />
                  );
                })
              }
            />
          </div>
          <Carousel
            className={styles.basicCoverModal}
            showArrows={true}
            showThumbs={false}
            ref={ref}
          >
            {images.map((image, index) => {
              return (
                <div className={styles.basicCoverImage} key={index}>
                  <div className={styles.basicImageWrapper}></div>
                  <ImageCropped
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "12px",
                    }}
                    src={image.url}
                    crop={{
                      x: image.x,
                      y: image.y,
                      w: image.width,
                      h: image.height,
                    }}
                  />
                </div>
              );
            })}
          </Carousel>
        </>
      ) : (
        <>
          <div className={commonStyles.basicTitleWrapper}>
            <Title content="Banners" />
          </div>
          <div className={styles.basicCoverButtonModal}>
            <Button.Solid
              style={{ backgroundColor: "rgba(31, 62, 47, 0.2)" }}
              color="white"
              size="small"
              content="Edit"
              onClick={() =>
                showModal<void>((resolve) => {
                  return (
                    <ModalEditImage
                      images={images}
                      suggestedImages={suggestions}
                      onChange={(newImages) => {
                        onImagesChange && onImagesChange(newImages);
                      }}
                      close={resolve}
                    />
                  );
                })
              }
            />
          </div>
        </>
      )}

      <div className={commonStyles.basicNote}>
        Image or Video. Minimum size of 808x632px.
      </div>
    </div>
  );
}

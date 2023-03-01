import Image from "next/image";
import React from "react";
import Cropper from "react-easy-crop";
import { List, arrayMove } from "react-movable";

import TagImageSuggestions from "../TagImageSuggestions";

import imageNiko from "./assets/niko.png";
import ItemImageCropped from "./components/ItemImageCropped";
import IconImage from "./icons/IconImage";
import IconImagePlaceholder from "./icons/IconImagePlaceholder";
import IconZoomIn from "./icons/IconZoomIn";
import IconZoomOut from "./icons/IconZoomOut";
import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  images: ProjectImage[];
  suggestedImages: ProjectImage[];
  onChange?: (images: ProjectImage[]) => void;
  close: () => void;
};

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export default function ModalEditImage({
  images,
  suggestedImages,
  onChange,
  close,
}: Props) {
  const [selectedImages, setSelectedImages] =
    React.useState<ProjectImage[]>(images);

  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  const [editingImage, setEditingImage] = React.useState<string>(
    images.length > 0 ? images[0].url : ""
  );

  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  return (
    <Modal open={true}>
      <div className={styles.imageModal}>
        <div className={styles.sideImageContainer}>
          <div
            className={styles.sideImage}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (event.dataTransfer.files == null) return;
              const files = Array.from(event.dataTransfer.files).filter(
                (file) => VALID_IMAGE_TYPES.includes(file.type)
              );
              if (files.length === 0) return;
              const newFileUrls = Array.from(files, (file) => {
                return URL.createObjectURL(file);
              });
              const newSelectedImage = [
                ...selectedImages,
                ...newFileUrls.map((url) => {
                  return {
                    url: url,
                    crop: { x: 0, y: 0, w: 1, h: 1 },
                  };
                }),
              ];
              setSelectedImages(newSelectedImage);
              setEditingImage(newFileUrls[0]);
            }}
          >
            <List
              values={selectedImages}
              beforeDrag={({ index }) => {
                setEditingImage(selectedImages[index].url);
              }}
              onChange={({ oldIndex, newIndex }) => {
                setSelectedImages(
                  arrayMove(selectedImages, oldIndex, newIndex)
                );
              }}
              renderList={({ children, props }) => (
                <div {...props}>{children}</div>
              )}
              renderItem={({ value, index, props }) =>
                index !== undefined && (
                  <div {...props}>
                    <ItemImageCropped
                      image={value}
                      onClick={() => {
                        setEditingImage(value.url);
                      }}
                      onClose={() => {
                        const newSelectedImage = [
                          ...selectedImages.slice(0, index),
                          ...selectedImages.slice(index + 1),
                        ];
                        setEditingImage(
                          newSelectedImage.length > 0
                            ? newSelectedImage[0].url
                            : ""
                        );
                        setSelectedImages(newSelectedImage);
                      }}
                    />
                  </div>
                )
              }
              container={document.getElementById("overlay-container")}
            />
            {selectedImages.length > 0 ? (
              <Divider.Horizontal className={styles.divider} />
            ) : null}

            <button
              className={styles.addImage}
              onClick={() => {
                if (logoFileInputRef.current != null) {
                  logoFileInputRef.current.click();
                }
              }}
            >
              <IconImage />
              <Title content="Upload" />
              <input
                type="file"
                multiple
                ref={logoFileInputRef}
                onChange={(event) => {
                  if (event.target.files) {
                    const newFileUrls = Array.from(event.target.files, (file) =>
                      URL.createObjectURL(file)
                    );
                    event.target.value = ""; // remove cached files
                    const newSelectedImage = [
                      ...selectedImages,
                      ...newFileUrls.map((url) => {
                        return {
                          url: url,
                          crop: { x: 0, y: 0, w: 1, h: 1 },
                        };
                      }),
                    ];
                    setSelectedImages(newSelectedImage);
                    setEditingImage(newFileUrls[0]);
                  }
                }}
                hidden
              />
            </button>
          </div>
        </div>
        <div className={styles.basicMainImageModal}>
          <div className={styles.basicImageEditor}>
            {selectedImages.length > 0 ? (
              <div className={styles.basicCropperWrapper}>
                <div className={styles.cropContainer}>
                  <Cropper
                    image={editingImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onCropAreaChange={(croppedArea) => {
                      const newSelectedImage = selectedImages.map((image) => {
                        if (image.url === editingImage) {
                          return {
                            url: editingImage,
                            crop: {
                              x: croppedArea.x / 100.0,
                              y: croppedArea.y / 100.0,
                              w: croppedArea.width / 100.0,
                              h: croppedArea.height / 100.0,
                            },
                          };
                        } else {
                          return image;
                        }
                      });
                      setSelectedImages(newSelectedImage);
                    }}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className={styles.controls}>
                  <IconZoomOut className={styles.zoomIcon} />
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(event) => {
                      setZoom(parseFloat(event.currentTarget.value));
                    }}
                    className={styles.zoomRange}
                  />
                  <IconZoomIn className={styles.zoomIcon} />
                </div>
              </div>
            ) : (
              <div className={styles.imagePlaceholderContainer}>
                <div className={styles.imagePlaceholder}>
                  <IconImagePlaceholder />
                </div>
              </div>
            )}
          </div>
          <TagImageSuggestions
            images={suggestedImages}
            onClickSetBanner={(url) => {
              const newSelectedImage = [
                ...selectedImages,
                {
                  url,
                  crop: { x: 0, y: 0, w: 1, h: 1 },
                },
              ];
              setSelectedImages(newSelectedImage);
              setEditingImage(url);
            }}
          />
        </div>
      </div>
      <Modal.Actions>
        <div className={styles.nikoContainer}>
          <Image
            className={styles.imageNiko}
            src={imageNiko}
            alt="niko"
            width={24}
            height={24}
            placeholder="blur"
          />
          <div className={styles.nikoMessage}>
            {selectedImages.length === 0
              ? "Upload new banners or choose from the suggested list"
              : "Nice!"}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button.Outline onClick={close}>Cancel</Button.Outline>
          <Button.Solid
            onClick={() => {
              onChange && onChange(selectedImages);
              close();
            }}
          >
            Save
          </Button.Solid>
        </div>
      </Modal.Actions>
    </Modal>
  );
}

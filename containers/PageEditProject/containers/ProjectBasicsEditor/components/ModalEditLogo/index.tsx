import Image from "next/image";
import React from "react";
import Cropper from "react-easy-crop";

import ImageCropped from "../../../../../../components/ImageCropped";
import IconImage from "../../icons/IconImage";
import TagLogoSuggestions from "../TagLogoSuggestions";

import imageNiko from "./assets/niko.png";
import IconClose from "./icons/IconClose";
import IconImagePlaceholder from "./icons/IconImagePlaceholder";
import IconZoomIn from "./icons/IconZoomIn";
import IconZoomOut from "./icons/IconZoomOut";
import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  logo: ProjectImage | null;
  suggestedImages: ProjectImage[];
  onChange?: (newValue: ProjectImage | null) => void;
  close: () => void;
};

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export default function ModalEditLogo({
  logo,
  suggestedImages,
  onChange,
  close,
}: Props) {
  const [selectedImage, setSelectedImage] = React.useState<ProjectImage | null>(
    logo
  );
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  const [editingImage, setEditingImage] = React.useState<string>(
    logo ? logo.url : ""
  );

  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  return (
    <Modal open={true}>
      <div className={styles.container}>
        <div className={styles.sideImageContainer}>
          <div
            className={styles.sideImageList}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files.item(0);
              if (file == null || !VALID_IMAGE_TYPES.includes(file.type))
                return;
              const url = URL.createObjectURL(file);
              if (typeof url !== "string") return;
              setSelectedImage({
                url: url,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
              });
              setEditingImage(url);
            }}
          >
            {selectedImage ? (
              <div className={styles.imageItemContainer}>
                <div className={styles.imageItem}>
                  <ImageCropped
                    className={styles.imageCropped}
                    src={selectedImage.url}
                    crop={{
                      x: selectedImage.x,
                      y: selectedImage.y,
                      w: selectedImage.width,
                      h: selectedImage.height,
                    }}
                  />
                  <button
                    className={styles.closeImageButton}
                    onClick={() => {
                      setSelectedImage(null);
                      setEditingImage("");
                    }}
                  >
                    <IconClose />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.buttonAddImage}
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
                  ref={logoFileInputRef}
                  onChange={(event) => {
                    if (event.target.files) {
                      const url = URL.createObjectURL(event.target.files[0]);
                      setSelectedImage({
                        url,
                        x: 0,
                        y: 0,
                        width: 1,
                        height: 1,
                      });
                      setEditingImage(url);
                    }
                  }}
                  hidden
                />
              </button>
            )}
          </div>
        </div>
        <div className={styles.mainImageModal}>
          <div className={styles.basicImageEditor}>
            {editingImage ? (
              <Cropper
                image={editingImage}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onCropAreaChange={(croppedArea) => {
                  const image = {
                    url: editingImage,
                    x: croppedArea.x / 100.0,
                    y: croppedArea.y / 100.0,
                    width: croppedArea.width / 100.0,
                    height: croppedArea.height / 100.0,
                  };
                  setSelectedImage(image);
                }}
                onZoomChange={setZoom}
              />
            ) : (
              <div className={styles.imagePlaceholderContainer}>
                <div className={styles.imagePlaceholder}>
                  <IconImagePlaceholder />
                </div>
              </div>
            )}
            <div className={styles.controls}>
              <IconZoomOut className={styles.zoomIcon} />
              {/**TODO: @sk-tenba: implement teiki-ui slider */}
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
          <TagLogoSuggestions
            images={suggestedImages}
            onClickSelectLogo={(url) => {
              setSelectedImage({
                url,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
              });
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
            {selectedImage == null
              ? "Upload a logo or choose one from the suggested list"
              : "Nice!"}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button.Outline onClick={close}>Cancel</Button.Outline>
          <Button.Solid
            className={styles.buttonActionContainer}
            onClick={() => {
              onChange && onChange(selectedImage);
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

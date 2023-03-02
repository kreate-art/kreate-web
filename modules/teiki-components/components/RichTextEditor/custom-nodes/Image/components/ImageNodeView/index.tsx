import { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";
import Image from "next/image";

import IconFileClose from "../../icons/IconFileClose";
import IconLoading from "../../icons/IconLoading";
import { getOptimalSize, parseLengthInPixel } from "../../utils";
import { ImageErrorBoundary } from "../ImageErrorBoundary";

import styles from "./index.module.scss";

import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";

export function ImageNodeView({
  editor,
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const src: string | undefined =
    typeof node.attrs.src === "string" ? node.attrs.src : undefined;
  const alt: string = typeof node.attrs.alt === "string" ? node.attrs.alt : "";
  const title: string | undefined =
    typeof node.attrs.title === "string" ? node.attrs.title : undefined;
  const width = parseLengthInPixel(node.attrs.width);
  const height = parseLengthInPixel(node.attrs.height);
  const editable = editor.isEditable;

  useMemo$Async(
    async (signal) => {
      if (!src || !editable) return;

      if (!src.startsWith("blob:")) {
        const response = await fetch(
          src.startsWith("data:")
            ? src
            : `/_proxy?${new URLSearchParams({ url: src })}`
        );
        signal.throwIfAborted();
        const blob = await response.blob();
        signal.throwIfAborted();
        const blobUrl = URL.createObjectURL(blob);
        if (width == null || height == null) {
          const size = await getOptimalSize(blobUrl);
          signal.throwIfAborted();
          updateAttributes({
            src: blobUrl,
            width: size.width,
            height: size.height,
          });
        } else {
          updateAttributes({ src: blobUrl });
        }
        return;
      }

      if (!width || !height) {
        const size = await getOptimalSize(src);
        signal.throwIfAborted();
        updateAttributes({
          width: size.width,
          height: size.height,
        });
        return;
      }
    },
    { debouncedDelay: 100 },
    [src, width, height, editable]
  );

  return (
    <NodeViewWrapper draggable data-drag-handle="">
      <div className={styles.imageContainer}>
        {typeof src !== "string" ? (
          <IconFileClose className={styles.iconFileClose} />
        ) : !editable || src.startsWith("blob:") ? (
          <ImageErrorBoundary>
            <Image
              className={styles.image}
              src={src}
              alt={alt}
              title={title}
              width={width || 0}
              height={height || 0}
            />
          </ImageErrorBoundary>
        ) : (
          <IconLoading className={styles.iconLoading} />
        )}
        <div className={selected ? styles.imageSelectedHalo : undefined} />
      </div>
    </NodeViewWrapper>
  );
}

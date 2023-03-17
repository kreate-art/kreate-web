import Image from "next/image";
import * as React from "react";

import { ImageErrorBoundary } from "../RichTextEditor/custom-nodes/Image/components/ImageErrorBoundary";

import styles from "./index.module.scss";
import { Crop, Size } from "./types";
import { shrinkRectToAspectRatio } from "./utils";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import {
  ALTERNATE_IPFS_GATEWAY_ORIGINS,
  IPFS_GATEWAY_ORIGIN,
} from "@/modules/env/client";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  src: string;
  alt?: string;
  crop: Crop;
};

const IPFS_ORIGINS = [
  IPFS_GATEWAY_ORIGIN,
  ...ALTERNATE_IPFS_GATEWAY_ORIGINS,
].map((o) => o + "/");

// TODO: All components should use `ImageView` instead of Next `Image`.
export default function ImageView({ className, style, src, alt, crop }: Props) {
  const [target, setTarget] = React.useState<HTMLDivElement | null>(null);
  const [imageSize, setImageSize] = React.useState<Size | undefined>(undefined);
  const targetSize = useElementSize(target);

  const targetRef = React.useCallback((target: HTMLDivElement | null) => {
    setTarget(target);
  }, []);

  // @sk-shishi: This is the "safest" option I have at the moment without messing up
  // all the usages of `CodecCid`.
  // The patched URL Must match the path in `middleware.ts`.
  let patchedSrc = src;
  if (process.env.NODE_ENV !== "development")
    for (const origin of IPFS_ORIGINS)
      if (src.startsWith(origin)) {
        patchedSrc = "/_ipfs/" + src.slice(origin.length);
        break;
      }

  const computed = React.useMemo(() => {
    if (!targetSize) return undefined;

    if (!imageSize) {
      return {
        bgSize: { w: targetSize.w / crop.w, h: targetSize.h / crop.h },
        bgPosition: { x: 0, y: 0 },
      };
    }

    const selectedRect = shrinkRectToAspectRatio(
      {
        x: crop.x * imageSize.w,
        y: crop.y * imageSize.h,
        w: crop.w * imageSize.w,
        h: crop.h * imageSize.h,
      },
      targetSize
    );

    const enlargedFactor = Math.max(
      targetSize.w / selectedRect.w,
      targetSize.h / selectedRect.h
    );

    const bgSize = {
      w: enlargedFactor * imageSize.w,
      h: enlargedFactor * imageSize.h,
    };

    const bgPosition = {
      x: -selectedRect.x * enlargedFactor,
      y: -selectedRect.y * enlargedFactor,
    };

    return { bgSize, bgPosition };
  }, [imageSize, targetSize, crop]);

  const handleImageLoaded = (img: HTMLImageElement) => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (isNaN(w) || isNaN(h)) return;
    if (!w || !h) return;
    setImageSize({ w, h });
  };

  return (
    <div className={className} style={style}>
      <div ref={targetRef} className={styles.image}>
        {patchedSrc && computed ? (
          // NOTE: @sk-kitsune: don't use ImageErrorBoundary
          <ImageErrorBoundary>
            <Image
              style={{
                transform: `translate(${computed.bgPosition.x}px, ${computed.bgPosition.y}px)`,
                filter: imageSize ? "none" : "blur(40px)",
              }}
              src={patchedSrc}
              alt={alt || ""}
              // @sk-shishi: Just a quick fix, because `w` and `h` can be NaN
              width={computed.bgSize.w || undefined}
              height={computed.bgSize.h || undefined}
              onLoadingComplete={(img) => {
                // NOTE: Sometimes, `img.complete` is `false`.
                // In this case, we have to wait until it is true.
                // https://app.asana.com/0/1203842063837585/1204018200083581
                if (img.complete) {
                  handleImageLoaded(img);
                } else {
                  img.addEventListener("load", (event) => {
                    const img = event.currentTarget;
                    if (!(img instanceof HTMLImageElement)) return;
                    handleImageLoaded(img);
                  });
                }
              }}
            />
          </ImageErrorBoundary>
        ) : null}
      </div>
    </div>
  );
}

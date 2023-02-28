import { Rect, Size } from "./types";

/**
 * Shrinks a `Size` to match an aspect ratio.
 * The result must be the one with the maximum area.
 */
export function shrinkSizeToAspectRatio(size: Size, aspectRatio: Size): Size {
  const unitLength = Math.min(size.w / aspectRatio.w, size.h / aspectRatio.h);
  return { w: unitLength * aspectRatio.w, h: unitLength * aspectRatio.h };
}

/**
 * Shrinks a `Rect` to match an aspect ratio.
 * The result must be the largest and have the same center.
 */
export function shrinkRectToAspectRatio(rect: Rect, aspectRatio: Size) {
  const { w, h } = shrinkSizeToAspectRatio(rect, aspectRatio);
  const center = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
  return { x: center.x - w / 2, y: center.y - h / 2, w, h };
}

export function toAbsoluteUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const { href } = new URL(url, location.href);
    return href;
  } catch {
    return undefined;
  }
}

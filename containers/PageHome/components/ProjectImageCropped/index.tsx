import * as React from "react";

import ImageCropped from "../../../../components/ImageCropped";

import { DEFAULT_PROJECT_IMAGE } from "./constants";

import { ProjectImage } from "@/modules/business-types";

type Props = {
  value: ProjectImage | null;
} & Omit<React.ComponentProps<typeof ImageCropped>, "src" | "crop">;

/**
 * Renders an `ImageCropped` to display a `ProjectImage`.
 *
 * If `value` is `null`, show the default image.
 */
export default function ProjectImageCropped({ value, ...others }: Props) {
  const actualValue = value || DEFAULT_PROJECT_IMAGE;
  return (
    <ImageCropped src={actualValue.url} crop={actualValue.crop} {...others} />
  );
}

import { pure, WithBufs } from "../../types/WithBufs";

import {
  fromArray,
  fromJSONContent,
  fromUrl,
  toArray,
  toJSONContent,
  toUrl,
} from "./utils";

import {
  Project,
  ProjectBasics,
  ProjectDescription,
  ProjectImage,
} from "@/modules/business-types";

async function fromProjectDescription({
  body,
  ...others
}: ProjectDescription): Promise<WithBufs<ProjectDescription>> {
  const bodyWB = await fromJSONContent(body);
  return {
    data: { body: bodyWB.data, ...others },
    bufs: bodyWB.bufs,
  };
}

function toProjectDescription({
  data: { body, ...others },
  bufs,
}: WithBufs<ProjectDescription>): ProjectDescription {
  return {
    body: toJSONContent({ data: body, bufs }),
    ...others,
  };
}

async function fromProjectImage({
  url,
  ...others
}: ProjectImage): Promise<WithBufs<ProjectImage>> {
  const urlWB = await fromUrl(url);
  return {
    data: { url: urlWB.data, ...others },
    bufs: urlWB.bufs,
  };
}

function toProjectImage({
  data: { url, ...others },
  bufs,
}: WithBufs<ProjectImage>): ProjectImage {
  return {
    url: toUrl({ data: url, bufs }),
    ...others,
  };
}

async function fromProjectBasics({
  coverImages,
  logoImage,
  ...others
}: ProjectBasics): Promise<WithBufs<ProjectBasics>> {
  const coverImagesWB = await fromArray(coverImages, fromProjectImage);
  const logoImageWB: WithBufs<ProjectImage | null> = logoImage
    ? await fromProjectImage(logoImage)
    : pure(null);
  return {
    data: {
      coverImages: coverImagesWB.data,
      logoImage: logoImageWB.data,
      ...others,
    },
    bufs: {
      ...coverImagesWB.bufs,
      ...logoImageWB.bufs,
    },
  };
}

function toProjectBasics({
  data: { coverImages, logoImage, ...others },
  bufs,
}: WithBufs<ProjectBasics>): ProjectBasics {
  return {
    coverImages: toArray({ data: coverImages, bufs }, toProjectImage),
    logoImage: logoImage ? toProjectImage({ data: logoImage, bufs }) : null,
    ...others,
  };
}

export async function fromProject({
  description,
  basics,
  ...others
}: Project): Promise<WithBufs<Project>> {
  const descriptionWB = await fromProjectDescription(description);
  const basicsWB = await fromProjectBasics(basics);
  return {
    data: {
      description: descriptionWB.data,
      basics: basicsWB.data,
      ...others,
    },
    bufs: {
      ...descriptionWB.bufs,
      ...basicsWB.bufs,
    },
  };
}

export function toProject({
  data: { description, basics, ...others },
  bufs,
}: WithBufs<Project>) {
  return {
    description: toProjectDescription({ data: description, bufs }),
    basics: toProjectBasics({ data: basics, bufs }),
    ...others,
  };
}

import { StaticImageData } from "next/image";

export type BlogSection = {
  title: string;
  picture: StaticImageData;
  createdAt: number;
  url: string;
  description: string;
};

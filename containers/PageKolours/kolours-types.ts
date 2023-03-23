import { LovelaceAmount } from "@/modules/business-types";

export type Color = string;

export type Image = {
  src: string;
};

export type PaletteItem = {
  image: Image;
  color: Color;
  minted: boolean;
  listedFee: LovelaceAmount | undefined; // before discount
  fee: LovelaceAmount | undefined; // after discount
};

export type Nft = {
  id: string;
  grayscaleImage: Image;
  palette: PaletteItem[];
  listedFee: LovelaceAmount | undefined; // before discount
  fee: LovelaceAmount | undefined; // after discount
};

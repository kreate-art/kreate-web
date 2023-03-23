import { LovelaceAmount } from "@/modules/business-types";

export type Kolour = string;

export type Image = {
  src: string;
};

export type PaletteItem = {
  image: Image;
  kolour: Kolour;
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

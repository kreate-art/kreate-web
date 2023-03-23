import { LovelaceAmount } from "@/modules/business-types";

export type Kolour = string;

export type Image = {
  src: string;
};

export type PaletteItem = {
  image: Image;
  kolour: Kolour;
  status: "free" | "booked" | "minted";
  listedFee: LovelaceAmount | undefined; // before discount
  fee: LovelaceAmount | undefined; // after discount
};

export type Nft = {
  id: string;
  initialImage: Image;
  palette: PaletteItem[];
  listedFee: LovelaceAmount | undefined; // before discount
  fee: LovelaceAmount | undefined; // after discount
};

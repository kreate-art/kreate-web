export type Color = string;

export type Image = {
  src: string;
};

export type PaletteItem = {
  image: Image;
  color: Color;
  minted: boolean;
};

export type Nft = {
  id: string;
  grayscaleImage: Image;
  palette: PaletteItem[];
};

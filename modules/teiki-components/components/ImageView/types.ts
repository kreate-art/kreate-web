export type Ratio = number; // 0.0 .. 1.0

export type LengthInPixels = number;

export type Size = {
  w: LengthInPixels;
  h: LengthInPixels;
};

export type Rect = {
  x: LengthInPixels;
  y: LengthInPixels;
  w: LengthInPixels;
  h: LengthInPixels;
};

export type Crop = {
  x: Ratio;
  y: Ratio;
  w: Ratio;
  h: Ratio;
};

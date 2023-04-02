import {
  Address,
  LovelaceAmount,
  UnixTimestamp,
} from "@/modules/business-types";

export type Kolour = string; // RRGGBB (hex, uppercase)

export type Referral = {
  id: string;
  discount: number;
};

export const DISCOUNT_MULTIPLIER = 10000;
export const DISCOUNT_MULTIPLIER_BI = BigInt(DISCOUNT_MULTIPLIER);

export type GenesisKreationId = string; // Act as token name also
export type GenesisKreationSlug = string;

export type GenesisKreationStatus = "unready" | "ready" | "booked" | "minted";

export type Image = { src: string };

export type Layer = {
  kolour: Kolour;
  image: Image;
  mask?: Image | undefined; // Luma mask
  status: "free" | "booked" | "minted";
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
};

// DEPRECATED
export type GenesisKreationEntry = {
  id: GenesisKreationId;
  slug: GenesisKreationSlug;
  status: GenesisKreationStatus;
  initialImage: Image;
  finalImage: Image;
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  palette: Layer[];
  createdAt: UnixTimestamp;
  name: string | null;
  userAddress: string | null;
  description: string[] | null;
};

export type GenesisKreationList = {
  kreations: GenesisKreation$Mint[];
  referral?: Referral;
};

export type KolourEntry = {
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  image: string; // ipfs://<cid>
};

export type KolourQuotationProgram =
  | { source: { type: "present" }; referral?: undefined }
  | { source: { type: "free" }; referral?: undefined }
  | {
      source: { type: "genesis_kreation"; kreation: string };
      referral?: Referral;
    };

export type KolourQuotationSource = KolourQuotationProgram["source"];

export type MintedKolourEntry = {
  kolour: Kolour;
  userAddress: string;
  fee: LovelaceAmount;
  expectedEarning: LovelaceAmount;
  createdAt: UnixTimestamp;
};

export type GenesisKreation$Mint = {
  id: GenesisKreationId;
  status: GenesisKreationStatus;
  initialImage: Image;
  finalImage: Image;
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  palette: Layer[];
  createdAt: UnixTimestamp;
};

export type GenesisKreation$Gallery = {
  id: GenesisKreationId;
  slug: GenesisKreationSlug;
  finalImage: Image;
  fee: LovelaceAmount;
  name: string | null;
  userAddress: string | null;
  description: string[] | null;
  palette: Kolour[];
  mintedAt: UnixTimestamp;
};

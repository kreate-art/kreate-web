import {
  Address,
  LovelaceAmount,
  UnixTimestamp,
} from "@/modules/business-types";

export type Kolour = string; // RRGGBB

export type GenesisKreationId = string; // Act as token name also

export type GenesisKreationStatus = "unready" | "ready" | "booked" | "minted";

// Reserved for future usage :)
export type ExtraParams = {
  referral?: string;
};

export type GenesisKreationQuotation = {
  id: GenesisKreationId;
  image: string; // ipfs://<cid>
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  userAddress: Address;
  feeAddress: Address;
  expiration: number; // Unix Timestamp in seconds
} & ExtraParams;

export type Image = { src: string };

export type Layer = {
  kolour: Kolour;
  image: Image;
  status: "free" | "booked" | "minted";
};

export type GenesisKreationEntry = {
  id: GenesisKreationId;
  status: GenesisKreationStatus;
  initialImage: Image;
  finalImage: Image;
  palette: Layer[];
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  createdAt: UnixTimestamp;
} & ExtraParams;

export type KolourEntry = {
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  image: string; // ipfs://<cid>
};

export type KolourQuotation = {
  kolours: Record<Kolour, KolourEntry>;
  userAddress: Address;
  feeAddress: Address;
  expiration: number; // Unix Timestamp in seconds
} & ExtraParams;

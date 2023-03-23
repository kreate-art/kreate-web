import {
  Address,
  LovelaceAmount,
  UnixTimestamp,
} from "@/modules/business-types";

export type Kolour = string; // RRGGBB

export type GenesisKreationId = string; // Act as token name also

export type GenesisKreationStatus = "unready" | "ready" | "booked" | "minted";

export type GenesisKreationQuotation = {
  id: GenesisKreationId;
  image: string; // ipfs://<cid>
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  userAddress: Address;
  feeAddress: Address;
  referral?: string;
  expiration: number; // Unix Timestamp in seconds
};

export type Image = { src: string };

export type Layer = {
  kolour: Kolour;
  image: Image;
  status: "free" | "booked" | "minted";
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
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
};

export type GenesisKreationList = {
  kreations: GenesisKreationEntry[];
  referral?: string;
};

export type KolourEntry = {
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  image: string; // ipfs://<cid>
};

export type KolourQuotation = {
  kolours: Record<Kolour, KolourEntry>;
  userAddress: Address;
  feeAddress: Address;
  referral?: string;
  expiration: number; // Unix Timestamp in seconds
};

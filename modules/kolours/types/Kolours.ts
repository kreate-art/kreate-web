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

export type GenesisKreationId = string; // Act as token name also

export type GenesisKreationStatus = "unready" | "ready" | "booked" | "minted";

export type GenesisKreationQuotation = {
  id: GenesisKreationId;
  image: string; // ipfs://<cid>
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  userAddress: Address;
  feeAddress: Address;
  referral?: Referral;
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
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  palette: Layer[];
  createdAt: UnixTimestamp;
  name: string | null;
  userAddress: string | null;
  description: string | null;
};

export type GenesisKreationList = {
  kreations: GenesisKreationEntry[];
  referral?: Referral;
};

export type KolourEntry = {
  fee: LovelaceAmount;
  listedFee: LovelaceAmount;
  image: string; // ipfs://<cid>
};

export type KolourQuotation = KolourQuotationProgram & {
  kolours: Record<Kolour, KolourEntry>;
  userAddress: Address;
  feeAddress: Address;
  expiration: number; // Unix Timestamp in seconds
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
  expectedEarning: LovelaceAmount | null;
};

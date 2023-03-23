import { Kolours } from "@/modules/kolours/types";

export type IndexOf<_T> = number;

export type Selection = Record<IndexOf<Kolours.Layer>, boolean>;

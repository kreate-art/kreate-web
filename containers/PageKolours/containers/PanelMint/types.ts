import { PaletteItem } from "../../kolours-types";

export type IndexOf<_T> = number;

export type Selection = Record<IndexOf<PaletteItem>, boolean>;

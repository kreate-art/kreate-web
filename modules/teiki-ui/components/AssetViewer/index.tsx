import { Ada$Compact } from "./components/Ada$Compact";
import { Ada$Standard } from "./components/Ada$Standard";
import { Teiki$Standard } from "./components/Teiki$Standard";
import { Usd$FromAda } from "./components/Usd$FromAda";
import { Usd$FromTeiki } from "./components/Usd$FromTeiki";

const AssetViewer = {
  Ada: {
    Standard: Ada$Standard,
    Compact: Ada$Compact,
  },
  Teiki: {
    Standard: Teiki$Standard,
  },
  Usd: {
    FromAda: Usd$FromAda,
    FromTeiki: Usd$FromTeiki,
  },
};

export default AssetViewer;

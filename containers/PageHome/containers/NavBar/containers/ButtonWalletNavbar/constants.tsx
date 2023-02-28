import Image from "next/image";

import cardwallet from "./wallet-logos/cardwallet.png";
import eternl from "./wallet-logos/eternl.png";
import flint from "./wallet-logos/flint.png";
import gerowallet from "./wallet-logos/gero.png";
import LogoNami from "./wallet-logos/LogoNami";
import nufi from "./wallet-logos/nufi.png";
import typhon from "./wallet-logos/typhon.png";

import { WalletName } from "@/modules/wallet/types";

export const WALLET_LOGO: {
  [key: WalletName]: React.ReactNode | undefined;
} = {
  nami: <LogoNami />,
  cardwallet: (
    <Image src={cardwallet} alt="card wallet" width={24} height={24} />
  ),
  nufi: <Image src={nufi} alt="nufi" width={24} height={24} />,
  eternl: <Image src={eternl} alt="eternl" width={24} height={24} />,
  flint: <Image src={flint} alt="flint" width={24} height={24} />,
  gerowallet: (
    <Image src={gerowallet} alt="gero wallet" width={24} height={24} />
  ),
  typhoncip30: <Image src={typhon} alt="typhon" width={24} height={24} />,
};

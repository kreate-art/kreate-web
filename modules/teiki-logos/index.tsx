import { Network } from "lucid-cardano";
import Image, { StaticImageData } from "next/image";

import logoTeikiCompact from "./images/teiki/compact.svg";
import logoTeikiFullBlackAlpha from "./images/teiki/full-black-alpha.svg";
import logoTeikiFullBlackTestnet from "./images/teiki/full-black-testnet.svg";
// import logoTeikiFullBlack from "./images/teiki/full-black.svg";
import logoTeikiFullWhiteAlpha from "./images/teiki/full-white-alpha.svg";
import logoTeikiFullWhiteTestnet from "./images/teiki/full-white-testnet.svg";
// import logoTeikiFullWhite from "./images/teiki/full-white.svg";
import LogoWalletCardWallet from "./images/wallets/cardwallet.png";
import LogoWalletEternl from "./images/wallets/eternl.png";
import LogoWalletFlint from "./images/wallets/flint.svg";
import LogoWalletGeroWallet from "./images/wallets/gerowallet.png";
import LogoWalletNami from "./images/wallets/nami.svg";
import LogoWalletNufi from "./images/wallets/nufi.svg";
import LogoWalletTyphon from "./images/wallets/typhoncip30.png";
import LogoWalletUnknown from "./images/wallets/unknown.svg";

import { WalletName } from "@/modules/wallet/types";

export {
  logoTeikiCompact,
  LogoWalletCardWallet,
  LogoWalletEternl,
  LogoWalletFlint,
  LogoWalletGeroWallet,
  LogoWalletNami,
  LogoWalletNufi,
  LogoWalletTyphon,
  LogoWalletUnknown,
};

export function getWalletLogo(walletName: WalletName): StaticImageData {
  switch (walletName) {
    case "cardwallet":
      return LogoWalletCardWallet;
    case "eternl":
      return LogoWalletEternl;
    case "flint":
      return LogoWalletFlint;
    case "gerowallet":
      return LogoWalletGeroWallet;
    case "nami":
      return LogoWalletNami;
    case "nufi":
      return LogoWalletNufi;
    case "typhoncip30":
      return LogoWalletTyphon;
    default:
      return LogoWalletUnknown;
  }
}

export function LogoWallet({
  className,
  style,
  walletName,
}: {
  className?: string;
  style?: React.CSSProperties;
  walletName: WalletName;
}) {
  return (
    <Image
      className={className}
      style={style}
      alt={walletName || "unknown"}
      src={getWalletLogo(walletName || "unknown")}
    />
  );
}

export function LogoTeikiFull({
  className,
  style,
  color,
  network,
}: {
  className?: string;
  style?: React.CSSProperties;
  color: "black-with-green-initial" | "white-with-green-initial";
  network: Network;
}) {
  switch (color) {
    case "black-with-green-initial":
      return (
        <Image
          className={className}
          style={style}
          src={
            network === "Mainnet"
              ? logoTeikiFullBlackAlpha
              : logoTeikiFullBlackTestnet
          }
          alt="logo teiki full black"
        />
      );
    case "white-with-green-initial":
      return (
        <Image
          className={className}
          style={style}
          src={
            network === "Mainnet"
              ? logoTeikiFullWhiteAlpha
              : logoTeikiFullWhiteTestnet
          }
          alt="logo teiki full white"
        />
      );
  }
}

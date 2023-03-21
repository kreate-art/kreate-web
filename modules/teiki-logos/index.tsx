import Image, { StaticImageData } from "next/image";

import logoKreateBeta from "./images/kreate/beta.svg";
import logoKreateTestnet from "./images/kreate/testnet.svg";
import logoKreateWhite from "./images/kreate/white.svg";
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

export function LogoKreateFull({
  className,
  style,
  network,
}: {
  className?: string;
  style?: React.CSSProperties;
  network: string;
}) {
  switch (network) {
    case "Mainnet":
      return (
        <Image
          className={className}
          style={style}
          src={logoKreateBeta}
          alt="logo kreate full"
        />
      );
    default:
      return (
        <Image
          className={className}
          style={style}
          src={logoKreateTestnet}
          alt="logo kreate full"
        />
      );
  }
}

export function LogoKreateWhite({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      className={className}
      style={style}
      src={logoKreateWhite}
      alt="logo kreate white"
    />
  );
}

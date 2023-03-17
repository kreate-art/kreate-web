import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import MessageView from "./components/MessageView";
import WalletView from "./components/WalletView";
import imageNiko from "./images/niko.png";
import styles from "./index.module.scss";
import { Message } from "./types";

import { KREATE_ENV } from "@/modules/env/client";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { LogoKreateWhite } from "@/modules/teiki-logos";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  collapsed?: boolean;
  messages: Message[];
};

// NOTE: @sk-kitsune: SideBar will not read aloud the messages.
// The caller has the responsibility to do it.
// TODO: @sk-kitsune: make ProjectEditor to speak the messages when they are added.
export default function SideBar({
  className,
  style,
  collapsed,
  messages,
}: Props) {
  const { walletStatus } = useAppContextValue$Consumer();

  const messagesDivRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const lastChild = messagesDivRef.current?.lastChild;
    if (!(lastChild instanceof Element)) return;
    lastChild.scrollIntoView(false);
  }, [messages.length, collapsed]);

  return (
    <div
      className={cx(
        styles.container,
        className,
        collapsed ? styles.collapsed : null
      )}
      style={style}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.logoTeikiWrapper}>
            <LogoKreateWhite />
          </Link>
        </div>
        {!collapsed ? (
          <div className={styles.headerRight}>
            <WalletView
              className={styles.walletView}
              walletStatus={walletStatus}
            />
          </div>
        ) : null}
      </div>
      <div className={styles.main}>
        {!collapsed ? (
          <div ref={messagesDivRef} className={styles.messages}>
            {messages.map((message) => (
              <MessageView key={message.id} value={message} />
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.footer}>
        <Image className={styles.imageNiko} src={imageNiko} alt="niko" />
        <div className={styles.buttonGroup}>
          {/* <Button.Solid size="small" content="Mute" /> */}
          {!collapsed ? (
            <Button.Solid
              size="small"
              content="Guideline"
              onClick={() => {
                window.open(
                  KREATE_ENV === "mainnet"
                    ? "https://docs.kreate.community/mainnet-guidelines/create-a-project"
                    : "https://docs.testnet.kreate.community/testnet-guidelines/create-a-project",
                  "_blank"
                );
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

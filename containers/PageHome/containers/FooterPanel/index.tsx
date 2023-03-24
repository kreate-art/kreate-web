import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import { TEIKI_CONNECTION_LIST } from "./constants/teiki-connection-list";
import styles from "./index.module.scss";

import { LogoKreateWhite } from "@/modules/teiki-logos";
import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title?: "community" | "kolour";
};

const FooterPanel = ({ className, style, title = "community" }: Props) => {
  const router = useRouter();
  return (
    <div className={cx(className, styles.container)} style={style}>
      <div className={styles.upperContainer}>
        <div className={styles.teiki}>
          <div className={styles.logo}>
            <LogoKreateWhite />
          </div>
          <Divider.Vertical />
          {title === "community" ? (
            <div className={styles.sloganCommunity}>
              Kreate with your Community
            </div>
          ) : (
            <div className={styles.sloganKolours}>Kolours</div>
          )}
        </div>
        <div className={styles.iconList}>
          {TEIKI_CONNECTION_LIST.map(
            ({ icon, url }: { icon: React.ReactNode; url: string }, index) => {
              return (
                <a href={url} key={index} target="_blank" rel="noreferrer">
                  <div className={styles.iconContainer}>{icon}</div>
                </a>
              );
            }
          )}
        </div>
      </div>
      <Divider.Horizontal color="white-05" />
      <div className={styles.lowerContainer}>
        <div>Copyright © Shinka Network</div>
        <div className={styles.routingPage}>
          <span
            className={styles.routingPageItem}
            onClick={() => router.push(`/podcasts`)}
          >
            Podcasts
          </span>
          <a
            className={styles.routingPageItem}
            href="https://discord.gg/4wv3MfKHdE"
            target="_blank"
            rel="noreferrer"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterPanel;

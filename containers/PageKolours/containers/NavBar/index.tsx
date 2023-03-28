import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import ButtonWalletNavbar from "../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar";

import IconGallery from "./icons/IconGallery";
import IconSwatches from "./icons/IconSwatches";
import styles from "./index.module.scss";

import { NETWORK } from "@/modules/env/client";
import { LogoKreateFull, LogoKreateWhite } from "@/modules/teiki-logos";
import Divider from "@/modules/teiki-ui/components/Divider";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  showGalleryButton?: boolean;
  showMintButton?: boolean;
};

export default function NavBar({
  className,
  style,
  showGalleryButton,
  showMintButton,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.main}>
        <div className={styles.leftMain}>
          <div>
            {NETWORK === "Preview" ? (
              <LogoKreateFull network={NETWORK} />
            ) : (
              <LogoKreateWhite />
            )}
          </div>
          <Divider.Vertical color="white-30" className={styles.vertical} />
          <div className={styles.kolours}> KOLOURS </div>
        </div>

        <Typography.Div
          color="white50"
          style={{ padding: "0px 16px" }}
          className={styles.discountAdvert}
        >
          <Typography.Span color="white" content="50-60% discount " />
          <Typography.Span color="white80" content="until April 7th " />
          <Typography.Span color="white50" content=" - " />
          <Typography.Span
            color="white"
            content="Kolour the Kreataverse now!"
          />
        </Typography.Div>

        <div className={styles.rightMain}>
          <ButtonWalletNavbar />
          {showGalleryButton ? (
            <Link href="/gallery">
              <div className={styles.buttonNav}>
                <IconGallery />
                <span>Gallery</span>
              </div>
            </Link>
          ) : null}
          {showMintButton ? (
            <Link href="/mint">
              <div className={styles.buttonNav}>
                <IconSwatches />
                <span>Mint</span>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

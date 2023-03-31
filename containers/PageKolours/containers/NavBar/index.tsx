import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import ButtonWalletNavbar from "../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar";

import IconGallery from "./icons/IconGallery";
import IconSwatches from "./icons/IconSwatches";
import styles from "./index.module.scss";

import { NETWORK } from "@/modules/env/client";
import { LogoKreateFull, LogoKreateWhite } from "@/modules/teiki-logos";
import Button from "@/modules/teiki-ui/components/Button";
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
          color="white80"
          style={{ padding: "0px 16px" }}
          className={styles.discountAdvert}
        >
          50-60% discount until April 7th!
        </Typography.Div>

        <div className={styles.rightMain}>
          {showMintButton ? (
            <Link href="/mint">
              <Button.Outline
                as="div"
                icon={<IconSwatches />}
                content="Mint"
                color="white"
              />
            </Link>
          ) : null}
          {showGalleryButton ? (
            <Link href="/gallery">
              <Button.Outline
                as="div"
                icon={<IconGallery />}
                content="Gallery"
                color="white"
              />
            </Link>
          ) : null}
          <ButtonWalletNavbar />
        </div>
      </div>
    </div>
  );
}

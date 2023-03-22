import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import ButtonWalletNavbar from "../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar";

import styles from "./index.module.scss";

import { NETWORK } from "@/modules/env/client";
import { LogoKreateFull, LogoKreateWhite } from "@/modules/teiki-logos";
import Divider from "@/modules/teiki-ui/components/Divider";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function NavBar({ className, style }: Props) {
  const router = useRouter();
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.main}>
        <div className={styles.leftMain}>
          <div style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
            {NETWORK === "Preview" ? (
              <LogoKreateFull network={NETWORK} />
            ) : (
              <LogoKreateWhite />
            )}
          </div>
          <Divider.Vertical color="white-30" className={styles.vertical} />
          <div className={styles.kolours}> KOLOURS </div>
        </div>
        <Typography.Span
          content="Kreators' Log #1: Kolours"
          color="white"
          className={styles.log}
        />
        <div className={styles.rightMain}>
          <ButtonWalletNavbar />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

import styles from "./index.module.scss";

import Divider from "@/modules/teiki-ui/components/Divider";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function Footer({ className, style }: Props) {
  return (
    <>
      <Divider.Horizontal color="white-05" />
      <div className={styles.footer}>
        <Typography.Div size="bodySmall" color="white">
          © 2023 Shinka Network
        </Typography.Div>
        <div className={styles.rightFooter}>
          <Link className={styles.link} href={"/podcasts"}>
            Podcasts
          </Link>
          <Link className={styles.link} href={"/"}>
            Contact us
          </Link>
        </div>
      </div>
    </>
  );
}

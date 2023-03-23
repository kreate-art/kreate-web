import Link from "next/link";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

export default function RemindBar() {
  return (
    <div className={styles.remindContainer}>
      <Typography.Span size="bodySmall" color="white" content="50% discount " />
      <Typography.Span
        size="bodySmall"
        color="white50"
        content={"on minting fees only "}
      />
      <Typography.Span
        size="bodySmall"
        color="white"
        content={"from March 24th to April 7th "}
      />
      <Typography.Span size="bodySmall" color="white50" content={"2023 - "} />
      <Link href="/">
        <Typography.Span
          size="heading6"
          color="orange"
          content="Kolour now!"
          style={{ textDecoration: "underline" }}
        />
      </Link>
    </div>
  );
}

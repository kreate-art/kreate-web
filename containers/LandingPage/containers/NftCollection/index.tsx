import Link from "next/link";

import WithAspectRatio from "../../../../components/WithAspectRatio";

import IconSwatches from "./components/IconSwatches";
import kolourNfts1 from "./image/kolour-nfts-1.png";
import kolourNfts2 from "./image/kolour-nfts-2.png";
import kolourNfts3 from "./image/kolour-nfts-3.png";
import kolourNfts4 from "./image/kolour-nfts-4.png";
import kolourNfts5 from "./image/kolour-nfts-5.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import Typography from "@/modules/teiki-ui/components/Typography";

export default function NftCollection() {
  return (
    <>
      <div className={styles.emphasisHeading}>
        Experience the first ever{" "}
        <span style={{ color: "#EC5929" }}> Web3 </span>
        <span style={{ color: "#EC5929" }}>
          Kolouring & Kolour Royalties NFT!
        </span>
        <span> only on Cardano. </span>
      </div>
      <div className={styles.nftsContainer}>
        <div className={styles.nfts} style={{ gridArea: "a" }}>
          <WithAspectRatio aspectRatio={2 / 1}>
            <ImageView
              className={styles.imageView}
              src={kolourNfts1.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          </WithAspectRatio>
        </div>
        <div className={styles.nfts} style={{ gridArea: "b" }}>
          <WithAspectRatio aspectRatio={2 / 1}>
            <ImageView
              className={styles.imageView}
              src={kolourNfts2.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          </WithAspectRatio>
        </div>
        <div className={styles.nfts} style={{ gridArea: "c" }}>
          <WithAspectRatio aspectRatio={2 / 1}>
            <ImageView
              className={styles.imageView}
              src={kolourNfts3.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          </WithAspectRatio>
        </div>
        <div className={styles.nfts} style={{ gridArea: "d" }}>
          <ImageView
            className={styles.imageView}
            src={kolourNfts4.src}
            crop={{ x: 0, y: 0, w: 1, h: 1 }}
          />
        </div>
        <div className={styles.nfts} style={{ gridArea: "e" }}>
          <WithAspectRatio aspectRatio={1 / 1}>
            <ImageView
              className={styles.imageView}
              src={kolourNfts5.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          </WithAspectRatio>
        </div>
      </div>
      <Link href="/kolours" className={styles.kolourButtonContainer}>
        <div className={styles.kolourButton}>
          <IconSwatches />
          <Typography.Span size="heading5" content="Kolour the Kreataverse" />
        </div>
      </Link>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";

import IconSwatches from "./components/IconSwatches";
import kolourNfts1 from "./image/kolour-nfts-1.png";
import kolourNfts2 from "./image/kolour-nfts-2.png";
import kolourNfts3 from "./image/kolour-nfts-3.png";
import kolourNfts4 from "./image/kolour-nfts-4.png";
import kolourNfts5 from "./image/kolour-nfts-5.png";
import kolourNfts6 from "./image/kolour-nfts-6.png";
import styles from "./index.module.scss";

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
      </div>
      <div className={styles.nftsContainer}>
        <div className={styles.nfts} style={{ gridArea: "a" }}>
          <Image
            className={styles.imageView}
            alt="kolour nft"
            src={kolourNfts1}
          />
        </div>
        <div className={styles.nfts} style={{ gridArea: "b" }}>
          <Image
            className={styles.imageView}
            alt="kolour nft"
            src={kolourNfts2}
          />
        </div>
        <div className={styles.nfts} style={{ gridArea: "c" }}>
          <Image
            className={styles.imageView}
            alt="kolour nft"
            src={kolourNfts3}
          />
        </div>
        <div className={styles.nfts} style={{ gridArea: "d" }}>
          <Image
            className={styles.imageView}
            alt="kolour nft"
            src={kolourNfts4}
          />
        </div>
        <div className={styles.nfts} style={{ gridArea: "e" }}>
          <Image
            className={styles.imageView}
            alt="kolour nft"
            src={kolourNfts5}
          />
        </div>
        <div className={styles.nfts} style={{ gridArea: "f" }}>
          <Image
            className={styles.imageView}
            alt="kolour nft"
            src={kolourNfts6}
          />
        </div>
      </div>
      <Link href="/gallery" className={styles.kolourButtonContainer}>
        <div className={styles.kolourButton}>
          <IconSwatches />
          <Typography.Span size="heading5" content="Explore the Gallery" />
        </div>
      </Link>
    </>
  );
}

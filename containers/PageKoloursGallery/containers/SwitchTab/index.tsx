import styles from "./index.module.scss";

import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  showMyNfts: boolean;
  onChangeShowMyNfts: () => void;
};

export default function SwitchTab({ showMyNfts, onChangeShowMyNfts }: Props) {
  const appContext = useAppContextValue$Consumer();
  return (
    <Flex.Row justifyContent="space-between">
      <div className={styles.buttonShowNftsContainer}>
        <button
          className={styles.buttonShowNfts}
          disabled={!showMyNfts}
          onClick={onChangeShowMyNfts}
        >
          All Minted NFTs
        </button>
        {appContext.walletStatus.status === "connected" ? (
          <button
            className={styles.buttonShowNfts}
            disabled={showMyNfts}
            onClick={onChangeShowMyNfts}
          >
            My NFTs
          </button>
        ) : null}
      </div>
    </Flex.Row>
  );
}

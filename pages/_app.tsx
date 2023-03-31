import { Inter, Roboto_Mono } from "@next/font/google";
import { Blockfrost } from "lucid-cardano";
import { AppProps } from "next/app";
import * as React from "react";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import {
  BLOCKFROST_PROJECT_ID,
  BLOCKFROST_URL,
  NETWORK,
} from "@/modules/env/client";
import { withModalPromises } from "@/modules/modal-promises";
import {
  AppContext as TeikiAppContext,
  useAppContextValue$Consumer,
  useAppContextValue$Provider,
} from "@/modules/teiki-contexts/contexts/AppContext";
import {
  useToast,
  withToastContext,
} from "@/modules/teiki-contexts/contexts/ToastContext";

const provider = new Blockfrost(BLOCKFROST_URL, BLOCKFROST_PROJECT_ID);

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-default",
  // Without `display: "swap"`, if the primary font does not load within
  // 100ms, the fallback font will be displayed.
  // https://nextjs.org/docs/basic-features/font-optimization#choosing-font-display
  display: "swap",
});

const fontRobotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-monospace",
  // Without `display: "swap"`, if the primary font does not load within
  // 100ms, the fallback font will be displayed.
  // https://nextjs.org/docs/basic-features/font-optimization#choosing-font-display
  display: "swap",
});

// TODO: The current code is quite messy. I will clean up later.
function withWalletNetworkWarning<P>(WrappedComponent: React.ComponentType<P>) {
  const WithWalletNetworkWarning: React.ComponentType<P> = (props: P) => {
    const { walletNetworkWarning } = useAppContextValue$Consumer();
    const { showMessage } = useToast();

    React.useEffect(() => {
      switch (walletNetworkWarning) {
        case "wrong-network":
          return showMessage({
            title: "Wrong Cardano Wallet Network!",
            description: `Please switch your wallet to the ${NETWORK} network.`,
            color: "danger",
          });
        case "maybe-wrong-network":
          return showMessage({
            title: "Wrong Cardano Wallet Network?!",
            description: `You may be connecting to the wrong Cardano network. Please make sure you are connecting to ${NETWORK}.`,
            color: "warning",
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletNetworkWarning]);

    return <WrappedComponent key="" {...props} />;
  };

  WithWalletNetworkWarning.displayName = `WithWalletNetworkWarning(${
    WrappedComponent.displayName || "..."
  })`;

  return WithWalletNetworkWarning;
}

function TeikiApp({ Component, pageProps }: AppProps) {
  const appContextValue = useAppContextValue$Provider({
    provider,
    network: NETWORK,
  });
  const WrappedComponent = React.useMemo(
    () =>
      withToastContext(withModalPromises(withWalletNetworkWarning(Component))),
    [Component]
  );
  useBodyClasses([
    fontInter.className,
    fontInter.variable,
    fontRobotoMono.variable,
  ]);

  return (
    <TeikiAppContext.Provider value={appContextValue}>
      <WrappedComponent {...pageProps} />
    </TeikiAppContext.Provider>
  );
}

export default withToastContext(withModalPromises(TeikiApp));

import { Inter, Roboto_Mono } from "@next/font/google";
import { Blockfrost, Network } from "lucid-cardano";
import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import * as React from "react";

import {
  NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  NEXT_PUBLIC_BLOCKFROST_URL,
  NEXT_PUBLIC_NETWORK,
} from "../config/client";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { withModalPromises } from "@/modules/modal-promises";
import Head from "@/modules/teiki-components/components/TeikiHead";
import {
  AppContext as TeikiAppContext,
  useAppContextValue$Consumer,
  useAppContextValue$Provider,
} from "@/modules/teiki-contexts/contexts/AppContext";
import {
  useToast,
  withToastContext,
} from "@/modules/teiki-contexts/contexts/ToastContext";

const provider = new Blockfrost(
  NEXT_PUBLIC_BLOCKFROST_URL,
  NEXT_PUBLIC_BLOCKFROST_PROJECT_ID
);

const network = NEXT_PUBLIC_NETWORK as Network;

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
            description: `Please switch your wallet to the ${NEXT_PUBLIC_NETWORK} network.`,
            color: "danger",
          });
        case "maybe-wrong-network":
          return showMessage({
            title: "Wrong Cardano Wallet Network?!",
            description: `You may be connecting to the wrong Cardano network. Please make sure you are connecting to ${NEXT_PUBLIC_NETWORK}.`,
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
  const appContextValue = useAppContextValue$Provider({ provider, network });
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

// TODO: Find a better workaround...
// Disable Automatic Static Optimization in `next build`...
// https://nextjs.org/docs/advanced-features/automatic-static-optimization
if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
  TeikiApp.getInitialProps = async (
    context: AppContext
  ): Promise<AppInitialProps> => {
    return await App.getInitialProps(context);
  };
}

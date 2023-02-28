import { useMicroTeikiAmountInWallet } from "./useMicroTeikiAmountInWallet";

import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { HttpGetUser$DetailedBackedProject } from "@/modules/next-backend-client/api/httpGetUser";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Params = {
  backedProjects: HttpGetUser$DetailedBackedProject[] | undefined;
};

type Result = {
  totalLovelaceAmount: LovelaceAmount | undefined;
  totalLovelaceAmount$Backed: LovelaceAmount | undefined;
  totalLovelaceAmount$InWallet: LovelaceAmount | undefined;
  totalMicroTeikiAmount: LovelaceAmount | undefined;
  totalMicroTeikiAmount$Unclaimed: LovelaceAmount | undefined;
  totalMicroTeikiAmount$InWallet: LovelaceAmount | undefined;
};

/**
 * Returns the amounts of ADA and TEIKI that user has.
 */

export function useBalanceSummary({
  backedProjects,
}: Params): [Result | undefined, DisplayableError | undefined] {
  const { walletStatus } = useAppContextValue$Consumer();

  const [microTeikiAmountInWallet, microTeikiAmountInWallet$Error] =
    useMicroTeikiAmountInWallet();

  const totalLovelaceAmount$Backed = backedProjects
    ? sumLovelaceAmount(backedProjects.map((item) => item.numLovelacesBacked))
    : undefined;

  const totalLovelaceAmount$InWallet =
    walletStatus.status === "connected"
      ? walletStatus.info.lovelaceAmount
      : undefined;

  const totalLovelaceAmount =
    totalLovelaceAmount$Backed != null && totalLovelaceAmount$InWallet
      ? sumLovelaceAmount([
          totalLovelaceAmount$Backed,
          totalLovelaceAmount$InWallet,
        ])
      : undefined;

  const totalMicroTeikiAmount$Unclaimed = backedProjects
    ? sumLovelaceAmount(
        backedProjects.map((item) => item.numMicroTeikisUnclaimed)
      )
    : undefined;

  const totalMicroTeikiAmount$InWallet = microTeikiAmountInWallet;

  const totalMicroTeikiAmount =
    totalMicroTeikiAmount$Unclaimed != null &&
    totalMicroTeikiAmount$InWallet != null
      ? sumLovelaceAmount([
          totalMicroTeikiAmount$Unclaimed,
          totalMicroTeikiAmount$InWallet,
        ])
      : undefined;

  const data = {
    totalLovelaceAmount,
    totalLovelaceAmount$Backed,
    totalLovelaceAmount$InWallet,
    totalMicroTeikiAmount,
    totalMicroTeikiAmount$Unclaimed,
    totalMicroTeikiAmount$InWallet,
  };

  const error = microTeikiAmountInWallet$Error;

  return [data, error];
}

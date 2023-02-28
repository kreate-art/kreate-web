import { buildTx } from "../utils/transaction";

import { ResultT, try$ } from "@/modules/async-utils";
import {
  LovelaceAmount,
  Project,
  ProjectAnnouncement,
} from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { useTxParams$CreatorUpdateProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorUpdateProject";
import { ipfsAdd$WithBufsAs$Blob } from "@/modules/next-backend-client/utils/ipfsAdd$WithBufsAs$Blob";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";
import CodecBlob from "@/modules/with-bufs-as-converters/codecs/CodecBlob";

export type TxBreakdown = {
  updateProject: LovelaceAmount;
  postCommunityUpdate: LovelaceAmount;
  extendsSponsorship: LovelaceAmount;
  transaction: LovelaceAmount;
};

type Params = {
  projectId: string;
  newSponsorshipAmount?: LovelaceAmount;
  project: Project;
  shouldPostAnnouncement: boolean;
  announcement: ProjectAnnouncement;
  disabled?: boolean;
};

export function useEstimatedFees({
  projectId,
  newSponsorshipAmount,
  project,
  shouldPostAnnouncement,
  announcement,
  disabled,
}: Params): ResultT<TxBreakdown> | undefined {
  const { walletStatus } = useAppContextValue$Consumer();
  const txParamsResult = useTxParams$CreatorUpdateProject({ projectId });

  const [txBreakdown, txBreakdown$Error] = useMemo$Async<TxBreakdown>(
    async () => {
      if (txParamsResult == null || disabled) return undefined;

      switch (walletStatus.status) {
        case "connected":
          break;
        case "disconnected":
          throw new DisplayableError({
            title: "Wallet is not connected",
            description: "Please connect your wallet.",
          });
        case "unknown":
          return undefined;
        case "connecting":
          return undefined;
      }

      const newInformationCid = await try$(
        async () => {
          const blobWBA: WithBufsAs<Project, Blob> =
            await Converters.fromProject(CodecBlob)(project);
          const cid = await ipfsAdd$WithBufsAs$Blob(blobWBA);
          return cid;
        },
        (cause) => {
          throw DisplayableError.from(cause, "Failed to upload files");
        }
      );

      const newAnnouncementCid = shouldPostAnnouncement
        ? await try$(
            async () => {
              const blobWBA: WithBufsAs<ProjectAnnouncement, Blob> =
                await Converters.fromProjectAnnouncement(CodecBlob)(
                  announcement
                );
              const cid = await ipfsAdd$WithBufsAs$Blob(blobWBA);
              return cid;
            },
            (cause) => {
              throw DisplayableError.from(cause, "Failed to upload files");
            }
          )
        : undefined;

      DisplayableError.assert(!txParamsResult.error, {
        title: "Transaction parameters invalid",
        cause: txParamsResult,
      });

      const { protocolParams, projectDetail } = txParamsResult.computed;
      DisplayableError.assert(
        newInformationCid !== projectDetail.informationCid.cid ||
          shouldPostAnnouncement ||
          newSponsorshipAmount,
        "No changes were made"
      );

      DisplayableError.assert(
        !shouldPostAnnouncement ||
          newAnnouncementCid !== projectDetail.lastAnnouncementCid?.cid,
        "You cannot repost the previous announcement"
      );

      const { sponsorshipFee, txComplete } = await try$(
        async () =>
          await buildTx({
            lucid: walletStatus.lucid,
            txParams: txParamsResult.data.txParams,
            newSponsorshipAmount,
            newInformationCid,
            newAnnouncementCid: shouldPostAnnouncement
              ? newAnnouncementCid
              : undefined,
          }),
        (error) => {
          throw DisplayableError.from(error, "Transaction build failed");
        }
      );

      const txBreakdown: TxBreakdown = {
        updateProject:
          newInformationCid !== projectDetail.informationCid.cid
            ? -protocolParams.projectInformationUpdateFee
            : 0,
        postCommunityUpdate: shouldPostAnnouncement
          ? -protocolParams.projectAnnouncementFee
          : 0,
        extendsSponsorship: newSponsorshipAmount ? -sponsorshipFee : 0,
        transaction: -BigInt(txComplete.txComplete.body().fee().to_str()),
      };

      return txBreakdown;
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
      toJson(txParamsResult),
      projectId,
      newSponsorshipAmount,
      project,
      shouldPostAnnouncement,
      announcement,
    ]
  );

  if (txBreakdown$Error) {
    return { ok: false, reason: txBreakdown$Error };
  } else if (txBreakdown) {
    return { ok: true, result: txBreakdown };
  } else {
    return undefined;
  }
}

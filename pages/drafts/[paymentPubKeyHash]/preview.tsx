import { GetServerSideProps } from "next";

import { getStorageId } from "../../../containers/PageEditProject/utils";
import PagePreviewProjectV2 from "../../../containers/PagePreviewProjectV2";

type Props = {
  paymentPubKeyHash: string;
};

export default function RouteToPagePreviewProject({
  paymentPubKeyHash,
}: Props) {
  return <PagePreviewProjectV2 storageId={getStorageId(paymentPubKeyHash)} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const paymentPubKeyHash = context.query["paymentPubKeyHash"];
  if (
    typeof paymentPubKeyHash !== "string" ||
    !/^[0-9A-Fa-f]*$/.test(paymentPubKeyHash)
  ) {
    return { notFound: true };
  }
  return { props: { paymentPubKeyHash } };
};

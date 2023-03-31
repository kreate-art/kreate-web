import { GetServerSideProps } from "next";

import PageEditProject from "../../../containers/PageEditProject";
import { getStorageId } from "../../../containers/PageEditProject/utils";

type Props = {
  paymentPubKeyHash: string;
};

export default function RouteToPageEditProject({ paymentPubKeyHash }: Props) {
  return <PageEditProject storageId={getStorageId(paymentPubKeyHash)} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const paymentPubKeyHash = context.query["paymentPubKeyHash"];
  if (
    typeof paymentPubKeyHash !== "string" ||
    !/^[0-9A-Fa-f]*$/.test(paymentPubKeyHash)
  )
    return { notFound: true };
  return { props: { paymentPubKeyHash } };
};

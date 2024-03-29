import { GetServerSideProps } from "next";

import PageKolourDetails from "../../../../containers/PageKolourDetails";

import { Kolour } from "@/modules/kolours/types/Kolours";

type Props = {
  kolour: Kolour;
};

export default function RouteToPageKolourDetails({ kolour }: Props) {
  return <PageKolourDetails kolour={kolour} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const kolour = context.params?.["kolour"];
  if (typeof kolour !== "string" || !/^[0-9A-F]+$/.test(kolour))
    return { notFound: true };
  return { props: { kolour } };
};

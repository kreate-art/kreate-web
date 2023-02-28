import PageProjectDetails from "../../../containers/PageProjectDetails";

import { db } from "@/modules/next-backend/db";
import { getDetailedProject } from "@/modules/next-backend/logic/getDetailedProject";

// eslint-disable-next-line react/prop-types
export default function RouteToPageProjectDetails() {
  return <PageProjectDetails />;
}

/**
 * The idea is to replace each media source in sha256
 * with is corresponding IPFS gateway URL in the `bufs` field
 */
export async function getServerSideProps(context: {
  params: { projectCustomUrl: string };
}) {
  const { params } = context;

  const result = await getDetailedProject(db, {
    customUrl: params.projectCustomUrl,
    preset: "minimal",
  });

  if (result.error === null) {
    return { props: {} };
  } else {
    return { notFound: true };
  }
}

import { GetServerSideProps } from "next";

import PagePreviewProjectV2 from "../../../containers/PagePreviewProjectV2";
import { getStorageId } from "../../../containers/PageUpdateProjectV2/utils/storage";

type Props = {
  projectId: string;
};

export default function RouteToPagePreviewProjectV2({ projectId }: Props) {
  return <PagePreviewProjectV2 storageId={getStorageId(projectId)} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const projectId = context.query["projectId"];
  if (typeof projectId !== "string" || !/^[0-9A-Fa-f]*$/.test(projectId)) {
    return { notFound: true };
  }
  return { props: { projectId } };
};

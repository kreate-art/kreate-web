import { GetServerSideProps } from "next";

import PagePreviewProject from "../../../containers/PagePreviewProject";
import { getStorageId } from "../../../containers/PageUpdateProjectV2/utils/storage";

type Props = {
  projectId: string;
};

export default function RouteToPagePreviewProject({ projectId }: Props) {
  return (
    <PagePreviewProject
      storageId={getStorageId(projectId)}
      projectId={projectId}
    />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const projectId = context.query["projectId"];
  if (typeof projectId !== "string" || !/^[0-9A-Fa-f]+$/.test(projectId))
    return { notFound: true };
  return { props: { projectId } };
};

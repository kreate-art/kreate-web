import { GetServerSideProps } from "next";

import PageUpdateProjectV2 from "../../../containers/PageUpdateProjectV2";

type Props = {
  projectId: string;
};

export default function RouteToPageUpdateProjectV2({ projectId }: Props) {
  return <PageUpdateProjectV2 projectId={projectId} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const projectId = context.query["projectId"];

  if (typeof projectId !== "string" || !/^[0-9A-Fa-f]+$/.test(projectId)) {
    return { notFound: true };
  }

  return { props: { projectId } };
};

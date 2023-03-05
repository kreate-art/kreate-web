import { GetServerSideProps } from "next";

import PageProjectDetails from "../../../containers/PageProjectDetails";

type Props = {
  projectId: string;
};

// eslint-disable-next-line react/prop-types
export default function RouteToPageProjectDetails({ projectId }: Props) {
  return (
    <PageProjectDetails projectCustomUrl={undefined} projectId={projectId} />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const projectId = context.params?.["projectId"];

  if (typeof projectId !== "string" || !/^[ -~]+$/.test(projectId)) {
    return { notFound: true };
  }

  // TODO: if project is not found, show page 404
  return {
    props: {
      projectId,
    },
  };
};

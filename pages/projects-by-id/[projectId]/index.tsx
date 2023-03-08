import { GetServerSideProps } from "next";

// eslint-disable-next-line react/prop-types
export default function RouteToPageProjectDetails() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const projectId = context.params?.["projectId"];

  if (typeof projectId !== "string" || !/^[ -~]+$/.test(projectId)) {
    return { notFound: true };
  }

  return {
    redirect: {
      permanent: true,
      destination: `/c-by-id/${projectId}`,
    },
  };
};

import { GetServerSideProps } from "next";

// eslint-disable-next-line react/prop-types
export default function RouteToPageProjectDetails() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const customUrl = params?.["customUrl"];

  if (typeof customUrl !== "string" || !/^[ -~]+$/.test(customUrl)) {
    return { notFound: true };
  }

  return {
    redirect: {
      permanent: true,
      destination: `/c/${customUrl}`,
    },
  };
};

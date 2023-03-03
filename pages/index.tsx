import { GetServerSideProps } from "next";
import { SWRConfig, unstable_serialize } from "swr";

import PageHome from "../containers/PageHome";

import { db } from "@/modules/next-backend/db";
import {
  getAllProjects,
  GetAllProjects$Params,
} from "@/modules/next-backend/logic/getAllProjects";
import { httpGetAllProjects$GetKey } from "@/modules/next-backend-client/api/httpGetAllProjects";

type Props = {
  fallback: Record<string, unknown>;
};

export default function RouteToPageHome({ fallback }: Props) {
  return (
    <SWRConfig value={{ fallback }}>
      <PageHome />
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  _context
) => {
  const featuredProjects$Params: GetAllProjects$Params = {
    category: "featured",
    active: true,
  };
  const featuredProjects$Key = httpGetAllProjects$GetKey(
    featuredProjects$Params
  );

  const sponsoredProjects$Params: GetAllProjects$Params = {
    category: "sponsor",
    active: true,
  };
  const sponsoredProjects$Key = httpGetAllProjects$GetKey(
    sponsoredProjects$Params
  );

  const regularProjects$FirstPage$Params: GetAllProjects$Params = {
    active: true,
    limit: 5,
    offset: 0,
  };
  const regularProjects$FirstPage$Key = httpGetAllProjects$GetKey(
    regularProjects$FirstPage$Params
  );

  const [
    featuredProjects$Response,
    sponsoredProjects$Response,
    regularProjects$FirstPage$Response,
  ] = await Promise.all([
    getAllProjects(db, featuredProjects$Params).catch((error) => {
      console.error("[SSR | Home | featuredProjects]", error);
      return undefined;
    }),
    getAllProjects(db, sponsoredProjects$Params).catch((error) => {
      console.error("[SSR | Home | sponsoredProjects]", error);
      return undefined;
    }),
    getAllProjects(db, regularProjects$FirstPage$Params).catch((error) => {
      console.error("[SSR | Home | regularProjects]", error);
      return undefined;
    }),
  ]);

  return {
    props: {
      fallback: {
        [unstable_serialize(featuredProjects$Key)]: featuredProjects$Response,
        [unstable_serialize(sponsoredProjects$Key)]: sponsoredProjects$Response,
        [unstable_serialize(regularProjects$FirstPage$Key)]:
          regularProjects$FirstPage$Response,
      },
    },
  };
};

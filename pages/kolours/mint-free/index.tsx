import { GetServerSideProps } from "next";
import * as React from "react";

import PageMintByColorPicker from "../../../containers/PageMintByColorPicker";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";

export default function RouteToPageMintByColorPicker() {
  return <PageMintByColorPicker />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  // TODO: remove this line after everything is done
  if (!SHOW_SECRET_ROUTES) {
    return { notFound: true };
  }
  return { props: {} };
};

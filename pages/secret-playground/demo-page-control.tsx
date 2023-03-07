import { GetServerSideProps } from "next";
import React from "react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";
import PageControl from "../../containers/PageEditProject/containers/ProjectEditor/components/PageControl";

import Resizable from "@/modules/teiki-components/components/Resizable";

export default function DemoPageControl() {
  const [value, setValue] = React.useState<0 | 1 | 2 | 3>(0);
  return (
    <article>
      <Resizable
        canResizeHeight
        style={{
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "lightgray",
        }}
      >
        <PageControl
          value={value}
          onChange={setValue}
          progress={{
            description: 0.0,
            basics: 0.333,
            community: 1.0,
          }}
        />
      </Resizable>
    </article>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (NEXT_PUBLIC_SHOW_SECRET_ROUTES !== "true") {
    return { notFound: true };
  }
  return { props: {} };
};

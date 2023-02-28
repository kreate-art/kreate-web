import { GetServerSideProps } from "next";
import * as React from "react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";

import Input from "@/modules/teiki-ui/components/Input";

export default function DemoInput() {
  const [value, setValue] = React.useState("");
  return (
    <div>
      <Input
        label={"Project Title"}
        placeholder="Give your project a title"
        onChange={setValue}
        value={value}
        style={{ width: "300px" }}
      />
      <div>{value}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (NEXT_PUBLIC_SHOW_SECRET_ROUTES !== "true") {
    return { notFound: true };
  }
  return { props: {} };
};

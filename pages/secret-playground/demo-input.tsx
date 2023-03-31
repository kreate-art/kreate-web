import { GetStaticProps } from "next";
import * as React from "react";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
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

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};

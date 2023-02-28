import { faker } from "@faker-js/faker";
import { GetServerSideProps } from "next";
import * as React from "react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";

import { toJson } from "@/modules/json-utils";
import Resizable from "@/modules/teiki-components/components/Resizable";
import Button from "@/modules/teiki-ui/components/Button";
import ComboBox from "@/modules/teiki-ui/components/ComboBox";
import { Suggestion } from "@/modules/teiki-ui/components/ComboBox/components/Text";

export default function DemoComboBox() {
  const [value, setValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);

  return (
    <article
      style={{ margin: "20px auto", padding: "20px", maxWidth: "800px" }}
    >
      <Button.Outline
        content="Add suggestion"
        onClick={() => {
          setSuggestions((items) => [
            ...items,
            { key: Date.now(), value: faker.lorem.sentences() },
          ]);
        }}
      />
      <pre>{toJson(suggestions, undefined, 2)}</pre>
      <Resizable canResizeHeight style={{ margin: "auto", padding: "20px" }}>
        <ComboBox.Text
          value={value}
          onChange={setValue}
          suggestions={suggestions}
          placeholder="Enter some text"
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

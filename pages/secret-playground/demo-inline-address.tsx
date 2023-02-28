import { GetServerSideProps } from "next";
import * as React from "react";
import { Form } from "semantic-ui-react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";

import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";

function getKeyOf<T>(obj: Record<string, T>, value: T) {
  for (const key in obj) {
    if (obj[key] === value) return key;
  }
  return undefined;
}

function Select<T>({
  value,
  onChange,
  label,
  options,
}: {
  value: T;
  onChange: (newValue: T) => void;
  label: string;
  options: Record<string, T>;
}) {
  const [initialValue] = React.useState(value);
  return (
    <Form.Select
      value={getKeyOf(options, value)}
      label={label}
      options={Object.keys(options).map((k) => ({ value: k, text: k }))}
      onChange={(_, { value }) =>
        onChange(
          typeof value === "string" && value in options
            ? options[value]
            : initialValue
        )
      }
    />
  );
}

export default function DemoInlineAddress() {
  const [fontWeight, setFontWeight] = React.useState<"400" | "600">("400");
  const [length, setLength] = React.useState<
    "short" | "medium" | "long" | "full" | "auto"
  >("short");

  return (
    <>
      <Form
        style={{
          border: "1px dashed gray",
          margin: "20px",
          padding: "20px",
        }}
      >
        <Form.Group>
          <Select
            label="Length"
            options={{
              short: "short",
              medium: "medium",
              long: "long",
              full: "full",
              auto: "auto",
            }}
            value={length}
            onChange={setLength}
          />
          <Select
            label="Font weight"
            options={{
              "400": "400",
              "600": "600",
            }}
            value={fontWeight}
            onChange={setFontWeight}
          />
        </Form.Group>
      </Form>
      <div
        style={{
          border: "1px dashed gray",
          margin: "20px",
          padding: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid black",
            resize: "horizontal",
            overflowX: "hidden",
          }}
        >
          {length !== "auto" ? (
            <InlineAddress
              style={{ fontWeight: fontWeight }}
              value="addr_test1mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
              length={length}
            />
          ) : (
            <InlineAddress.Auto
              style={{ fontWeight: fontWeight, width: "100%" }}
              value="addr_test1mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
            />
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (NEXT_PUBLIC_SHOW_SECRET_ROUTES !== "true") {
    return { notFound: true };
  }
  return { props: {} };
};

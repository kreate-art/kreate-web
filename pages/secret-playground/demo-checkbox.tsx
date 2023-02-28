import { GetServerSideProps } from "next";
import * as React from "react";
import { Form } from "semantic-ui-react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";

import Checkbox from "@/modules/teiki-ui/components/Checkbox";

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

export default function DemoCheckbox() {
  const [value, setValue] = React.useState(false);
  const [showLabel, setShowLabel] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
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
            label="Show label"
            options={{ false: false, true: true }}
            value={showLabel}
            onChange={setShowLabel}
          />

          <Select
            label="Disabled"
            options={{ false: false, true: true }}
            value={isDisabled}
            onChange={setIsDisabled}
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
        <Checkbox
          value={value}
          onChange={setValue}
          label={
            showLabel
              ? "If you're looking for random paragraphs, you've come to the right place. When a random word or a random sentence isn't quite enough, the next logical step is to find a random paragraph. We created the Random Paragraph Generator with you in mind. The process is quite simple. Choose the number of random paragraphs you'd like to see and click the button. Your chosen number of paragraphs will instantly appear."
              : ""
          }
          disabled={isDisabled}
        />
        <div>The value of checkbox is: {value.toString()}</div>
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

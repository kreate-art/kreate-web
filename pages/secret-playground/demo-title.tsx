import * as React from "react";
import { Form } from "semantic-ui-react";

import Resizable from "@/modules/teiki-components/components/Resizable";
import Title from "@/modules/teiki-ui/components/Title";

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

export default function DemoTitle() {
  const [size, setSize] = React.useState<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined
  >(undefined);
  const [fontWeight, setFontWeight] = React.useState<
    "bold" | "regular" | "semibold" | "black" | "default"
  >("default");
  const [maxLines, setMaxLines] = React.useState<"1" | "2" | "3" | undefined>(
    undefined
  );
  const [color, setColor] = React.useState<
    | "ink"
    | "ink100"
    | "green"
    | "green100"
    | "white"
    | "white100"
    | "red"
    | "red100"
    | undefined
  >(undefined);
  const [content, setContent] = React.useState("");
  return (
    <article style={{ margin: "auto", maxWidth: "800px" }}>
      <Form
        style={{
          border: "1px dashed gray",
          margin: "20px",
          padding: "20px",
        }}
      >
        <Form.Input
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Form.Group>
          <Select
            label="Font size"
            options={{
              h1: "h1",
              h2: "h2",
              h3: "h3",
              h4: "h4",
              h5: "h5",
              h6: "h6",
            }}
            value={size}
            onChange={setSize}
          />
          <Select
            label="Font weight"
            options={{
              regular: "regular",
              semibold: "semibold",
              bold: "bold",
              black: "black",
              default: "default",
            }}
            value={fontWeight}
            onChange={setFontWeight}
          />
          <Select
            label="color"
            options={{
              ink: "ink",
              ink100: "ink100",
              green: "green",
              green100: "green100",
              white: "white",
              white100: "white100",
              red: "red",
              red100: "red100",
            }}
            value={color}
            onChange={setColor}
          />
          <Select
            label="Max lines"
            options={{
              "1": "1",
              "2": "2",
              "3": "3",
            }}
            value={maxLines}
            onChange={setMaxLines}
          />
        </Form.Group>
      </Form>
      <div
        style={{
          margin: "20px",
          padding: "20px",
          backgroundColor: color === "white" ? "gray" : undefined,
          display: "flex",
          justifyContent: "center",
          flexWrap: "nowrap",
        }}
      >
        <Title
          content={content}
          color={color}
          fontWeight={fontWeight}
          size={size}
          maxLines={maxLines}
        />
      </div>
    </article>
  );
}

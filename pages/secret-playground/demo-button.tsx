import { GetServerSideProps } from "next";
import * as React from "react";
import { Form } from "semantic-ui-react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";

import { toJson } from "@/modules/json-utils";
import Resizable from "@/modules/teiki-components/components/Resizable";
import Button from "@/modules/teiki-ui/components/Button";

function IconBento() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1609_750)">
        <path
          d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1609_750">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

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

export default function DemoButton() {
  const [content, setContent] = React.useState("Click Me!");
  const [showIcon, setShowIcon] = React.useState(false);
  const [iconPosition, setIconPosition] = React.useState<"left" | "right">(
    "left"
  );
  const [size, setSize] = React.useState<
    "extraSmall" | "small" | "medium" | "large"
  >("medium");
  const [circular, setCircular] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [color, setColor] = React.useState<
    "green" | "white" | "primary" | "secondary"
  >("green");

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
            label="Show Icon"
            options={{ false: false, true: true }}
            value={showIcon}
            onChange={setShowIcon}
          />
          <Select
            label="Icon Position"
            options={{ left: "left", right: "right" }}
            value={iconPosition}
            onChange={setIconPosition}
          />
          <Select
            label="Size"
            options={{
              extraSmall: "extraSmall",
              small: "small",
              medium: "medium",
              large: "large",
            }}
            value={size}
            onChange={setSize}
          />
        </Form.Group>
        <Form.Group>
          <Select
            label="Color"
            options={{
              green: "green",
              white: "white",
              primary: "primary",
              secondary: "secondary",
            }}
            value={color}
            onChange={setColor}
          />
          <Select
            label="Circular"
            options={{ false: false, true: true }}
            value={circular}
            onChange={setCircular}
          />
          <Select
            label="Disabled"
            options={{ false: false, true: true }}
            value={disabled}
            onChange={setDisabled}
          />
        </Form.Group>
        <pre>
          {toJson(
            {
              content,
              showIcon,
              iconPosition,
              size,
              circular,
              disabled,
              color,
            },
            undefined,
            2
          )}
        </pre>
      </Form>

      <Resizable
        style={{
          margin: "20px",
          padding: "20px",
          backgroundColor: color === "white" ? "gray" : undefined,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button.Solid
            content={content}
            icon={showIcon ? <IconBento /> : undefined}
            iconPosition={iconPosition}
            size={size}
            circular={circular}
            disabled={disabled}
            color={color}
          />
          <Button.Outline
            content={content}
            icon={showIcon ? <IconBento /> : undefined}
            iconPosition={iconPosition}
            size={size}
            circular={circular}
            disabled={disabled}
            color={color}
          />
        </div>
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

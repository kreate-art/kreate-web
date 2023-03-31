import { GetStaticProps } from "next";
import * as React from "react";
import { Form } from "semantic-ui-react";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
import TextArea from "@/modules/teiki-ui/components/TextArea";

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

function EmptyDiv({ backgroundColor }: { backgroundColor: string }) {
  return (
    <div
      style={{
        minWidth: "10px",
        minHeight: "10px",
        backgroundColor,
      }}
    />
  );
}

export default function DemoTextarea() {
  const [content, setContent] = React.useState("");
  const [isResizable, setIsResizable] = React.useState(false);
  const [showTopSlot, setShowTopSlot] = React.useState(false);
  const [showLeftSlot, setShowLeftSlot] = React.useState(false);
  const [showRightSlot, setShowRightSlot] = React.useState(false);
  const [showBottomSlot, setShowBottomSlot] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [numRows, setNumRows] = React.useState(3);
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
            label="Show Left Slots"
            options={{ false: false, true: true }}
            value={showLeftSlot}
            onChange={setShowLeftSlot}
          />
          <Select
            label="Show Right Slots"
            options={{ false: false, true: true }}
            value={showRightSlot}
            onChange={setShowRightSlot}
          />
        </Form.Group>
        <Form.Group>
          <Select
            label="Show Top Slots"
            options={{ false: false, true: true }}
            value={showTopSlot}
            onChange={setShowTopSlot}
          />
          <Select
            label="Show Bottom Slots"
            options={{ false: false, true: true }}
            value={showBottomSlot}
            onChange={setShowBottomSlot}
          />
        </Form.Group>
        <Form.Group>
          <Select
            label="Resizable"
            options={{ false: false, true: true }}
            value={isResizable}
            onChange={setIsResizable}
          />
          <Select
            label="Disable"
            options={{ false: false, true: true }}
            value={isDisabled}
            onChange={setIsDisabled}
          />
          <Select
            label="Num rows"
            options={{ "3": 3, "5": 5, "7": 7 }}
            value={numRows}
            onChange={setNumRows}
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
        <TextArea
          value={content}
          resizable={isResizable}
          onChange={(value) => setContent(value)}
          topSlot={
            showTopSlot ? (
              <>
                <EmptyDiv backgroundColor="hsl(0.1rad, 80%, 80%)" />
                <EmptyDiv backgroundColor="hsl(0.2rad, 80%, 80%)" />
              </>
            ) : null
          }
          leftSlot={
            showLeftSlot ? (
              <>
                <EmptyDiv backgroundColor="hsl(0.3rad, 80%, 80%)" />
                <EmptyDiv backgroundColor="hsl(0.4rad, 80%, 80%)" />
              </>
            ) : null
          }
          placeholder="Summarize your project from 25 to 50 words"
          rightSlot={
            showRightSlot ? (
              <>
                <EmptyDiv backgroundColor="hsl(0.5rad, 80%, 80%)" />
                <EmptyDiv backgroundColor="hsl(0.6rad, 80%, 80%)" />
              </>
            ) : null
          }
          bottomSlot={
            showBottomSlot ? (
              <>
                <EmptyDiv backgroundColor="hsl(0.7rad, 80%, 80%)" />
                <EmptyDiv backgroundColor="hsl(0.8rad, 80%, 80%)" />
              </>
            ) : null
          }
          disabled={isDisabled}
          rows={numRows}
        />
        <div>{content}</div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};

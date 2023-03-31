import { GetStaticProps } from "next";
import * as React from "react";
import { Form } from "semantic-ui-react";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
import Button from "@/modules/teiki-ui/components/Button";
import Modal from "@/modules/teiki-ui/components/Modal";

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
  const getKeyOf = function <T>(obj: Record<string, T>, value: T) {
    for (const key in obj) {
      if (obj[key] === value) return key;
    }
    return undefined;
  };

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

export default function DemoModal() {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<"medium" | "small">("medium");
  const [closeOnEscape, setCloseOnEscape] = React.useState(true);
  const [closeOnDimmerClick, setCloseOnDimmerClick] = React.useState(true);
  return (
    <article style={{ margin: "auto", maxWidth: "800px" }}>
      <Form style={{ margin: "20px" }}>
        <Form.Group>
          <Select
            value={size}
            onChange={setSize}
            label="Size"
            options={{ medium: "medium", small: "small" }}
          />
          <Select
            value={closeOnEscape}
            onChange={setCloseOnEscape}
            label="Close on Escape"
            options={{ false: false, true: true }}
          />
          <Select
            value={closeOnDimmerClick}
            onChange={setCloseOnDimmerClick}
            label="Close on Dimmer Click"
            options={{ false: false, true: true }}
          />
        </Form.Group>
        <Button.Solid content="Open Modal" onClick={() => setOpen(true)} />
      </Form>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size={size}
        closeOnEscape={closeOnEscape}
        closeOnDimmerClick={closeOnDimmerClick}
      >
        <Modal.Header content="Heads up!" />
        <Modal.Content>
          <Modal.Description content="Do you want to proceed?" />
        </Modal.Content>
        <Modal.Actions>
          <Button.Solid
            color="white"
            content="Cancel"
            onClick={() => setOpen(false)}
          />
          <Button.Solid content="OK" onClick={() => setOpen(false)} autoFocus />
        </Modal.Actions>
      </Modal>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};

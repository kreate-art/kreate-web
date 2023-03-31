import { faker } from "@faker-js/faker";
import { GetStaticProps } from "next";
import React from "react";
import { Form } from "semantic-ui-react";

import SideBar from "../../containers/PageEditProject/containers/ProjectEditor/components/SideBar";
import { Message } from "../../containers/PageEditProject/containers/ProjectEditor/components/SideBar/types";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
import Resizable from "@/modules/teiki-components/components/Resizable";

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

function generateNewString(): Message {
  const choices = [
    "Hey Jude, don't make it bad.",
    "Take a sad song and make it better.",
    "Remember to let her into your heart,",
    "Then you can start to make it better.",
    "Hey Jude, don't be afraid.",
    "You were made to go out and get her.",
    "The minute you let her under your skin,",
    "Then you begin to make it better.",
  ];
  return {
    id: Date.now(),
    createdAt: Date.now(),
    type: "string",
    body: faker.helpers.arrayElement(choices),
  };
}

function generateNewNode(): Message {
  const choices = [
    () => (
      <span>
        And anytime you feel the <strong>pain</strong>, hey Jude, refrain,
      </span>
    ),
    () => (
      <span>
        <strong>{"Don't"}</strong> carry the world upon your{" "}
        <strong>shoulders</strong>.
      </span>
    ),
    () => (
      <span>
        For <strong>well</strong> you know that {"it's"} a fool{" "}
        <strong>who</strong> plays it cool
      </span>
    ),
    () => (
      <span>
        By <strong>making</strong> his world a little <strong>colder</strong>.
      </span>
    ),
  ];
  return {
    id: Date.now(),
    createdAt: Date.now(),
    type: "node",
    body: faker.helpers.arrayElement(choices)(),
  };
}

export default function DemoSideBar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  return (
    <article
      style={{
        margin: "20px auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
      }}
    >
      <Form style={{ width: "400px", flex: "0 0 auto" }}>
        <Select
          value={collapsed}
          onChange={setCollapsed}
          label="Collapsed"
          options={{ false: false, true: true }}
        />
        <Form.Field>
          <label>Messages</label>
          <Form.Group>
            <Form.Button
              content="Add String"
              onClick={() =>
                setMessages((items) => [...items, generateNewString()])
              }
            />
            <Form.Button
              content="Add Node"
              onClick={() =>
                setMessages((items) => [...items, generateNewNode()])
              }
            />
            <Form.Button content="Clear" onClick={() => setMessages([])} />
          </Form.Group>
          <ul style={{ maxHeight: "200px", overflow: "auto" }}>
            {messages.map((m) => (
              <li key={m.id} title={`${m.createdAt} ${m.id}`}>
                {m.type}
              </li>
            ))}
          </ul>
        </Form.Field>
      </Form>
      <Resizable
        canResizeHeight
        style={{
          margin: "0 auto",
          width: "400px",
          height: "600px",
          backgroundColor: "lightgray",
          paddingRight: "36px",
        }}
      >
        <SideBar
          collapsed={collapsed}
          style={{ height: "100%" }}
          messages={messages}
        />
      </Resizable>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};

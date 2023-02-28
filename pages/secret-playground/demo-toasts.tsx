import { faker } from "@faker-js/faker";
import * as React from "react";

import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";

export default function DemoToasts() {
  const { alert, showMessage } = useToast();
  return (
    <article style={{ margin: "20px auto", textAlign: "center" }}>
      <Button.Outline
        content="alert()"
        onClick={() => alert(faker.lorem.sentence())}
      />
      <Button.Outline
        content="showMessage()"
        onClick={() =>
          showMessage({
            title: faker.lorem.sentence(),
            description: faker.helpers.arrayElement([
              faker.lorem.lines(),
              faker.lorem.paragraph(),
              faker.lorem.words(),
            ]),
            color: faker.helpers.arrayElement([
              "info",
              "warning",
              "success",
              "danger",
              undefined,
            ]),
          })
        }
      />
    </article>
  );
}

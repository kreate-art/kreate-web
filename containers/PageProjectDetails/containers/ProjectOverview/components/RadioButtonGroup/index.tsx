import cx from "classnames";
import * as React from "react";
import { Form, Radio } from "semantic-ui-react";

import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export default function RadioButtonGroup({ className, style, title }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <Form>
        <Form.Field className={styles.field}>
          <Radio className={styles.radio} checked={true} />
          <Title>Immediately</Title>
        </Form.Field>
        <Form.Field className={styles.field}>
          <Radio className={styles.radio} checked={false} disabled />
          <Title>Schedule the closing time</Title>
        </Form.Field>
      </Form>
    </div>
  );
}

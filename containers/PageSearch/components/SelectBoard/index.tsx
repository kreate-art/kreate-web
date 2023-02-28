import { Checkbox } from "semantic-ui-react";

import styles from "./index.module.scss";

type Props = {
  tags: string[];
  selectedTags: string[];
  onChange?: (tag: string) => void;
};

export default function SelectBoard({ tags, selectedTags, onChange }: Props) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Tags</div>
        <div className={styles.tagGroup}>
          {tags.slice(0, 15).map((tag) => (
            <Checkbox
              key={tag}
              defaultChecked={selectedTags.includes(tag)}
              onChange={() => {
                onChange && onChange(tag);
              }}
              className={styles.checkbox}
              label={tag}
            />
          ))}
        </div>
      </div>
    </>
  );
}

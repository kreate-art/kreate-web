import PopularTag from "./components/PopularTag";
import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  error?: unknown;
  data?: {
    tags: string[];
  };
  onClick?: (tag: string) => void;
};

export default function DropdownPopularTag({ error, data, onClick }: Props) {
  return (
    <div>
      <Title className={styles.title}>POPULAR TAGS</Title>
      <div className={styles.group}>
        {error
          ? "error"
          : !data
          ? "loading"
          : data.tags
              .slice(0, 4)
              .map((tag, index) => (
                <PopularTag
                  key={index}
                  onClick={() => onClick && onClick(tag)}
                  tag={tag}
                />
              ))}
      </div>
    </div>
  );
}

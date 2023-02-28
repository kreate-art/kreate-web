import styles from "./index.module.scss";

type Props = {
  tag: string;
  onClick?: () => void;
};

export default function PopularTag({ tag, onClick }: Props) {
  return (
    <button onClick={onClick} className={styles.tag}>
      {tag}
    </button>
  );
}

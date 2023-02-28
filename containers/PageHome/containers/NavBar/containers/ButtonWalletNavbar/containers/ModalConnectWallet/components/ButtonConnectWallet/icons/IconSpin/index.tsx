import styles from "./index.module.scss";

export default function IconSpin() {
  return (
    <svg className={styles.spinner} viewBox="0 0 50 50">
      <circle
        className={styles.path}
        cx="24"
        cy="24"
        r="16.8"
        fill="none"
        strokeWidth="5"
      />
    </svg>
  );
}

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function IconCaretDown({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 10L12 14L8 10"
        stroke="#00362C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

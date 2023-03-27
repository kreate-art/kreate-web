type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function IconGallery({ className, style }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17.0002L8.22999 10.8985C8.63274 10.4286 9.36128 10.4337 9.75746 10.9091L13.299 15.1589C13.6754 15.6107 14.3585 15.6417 14.7743 15.2259L16.21 13.7902C16.6314 13.3688 17.3256 13.4072 17.698 13.8726L21 18.0002"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

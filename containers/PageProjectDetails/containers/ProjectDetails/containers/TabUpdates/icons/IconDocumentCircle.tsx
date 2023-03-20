export default function IconDocumentCircle({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="48"
      height="49"
      viewBox="0 0 48 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24.5" r="24" fill="#222222" />
      <path
        d="M30 34H18C17.4477 34 17 33.5523 17 33L17 17C17 16.4477 17.4477 16 18 16L25.5631 16C25.8416 16 26.1076 16.1162 26.2968 16.3206L30.7338 21.1125C30.9049 21.2973 31 21.5399 31 21.7919L31 33C31 33.5523 30.5523 34 30 34Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 30H27"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 27H27"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 22L26 22C25.4477 22 25 21.5523 25 21L25 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

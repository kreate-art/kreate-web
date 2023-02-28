export default function IconDocumentCircle({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
    >
      <circle cx="24" cy="24" r="24" fill="#008A45" />
      <g clipPath="url(#a)">
        <path
          fill="#fff"
          d="M28 15H17a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V20l-5-5Zm-9 4h5v2h-5v-2Zm10 10H19v-2h10v2Zm0-4H19v-2h10v2Zm-2-4v-4l4 4h-4Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M12 12h24v24H12z" />
        </clipPath>
      </defs>
    </svg>
  );
}

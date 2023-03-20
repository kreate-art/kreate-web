import Link from "next/link";
import * as React from "react";

import { formatToEntry } from "./utils";

import Button from "@/modules/teiki-ui/components/Button";

type SocialChannelUrl = string;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: SocialChannelUrl;
};

export default function ButtonSocialChannel({
  className,
  style,
  value,
}: Props) {
  const { icon: Icon, isSafe, tooltip, url } = formatToEntry(value);
  return (
    <Link
      className={className}
      style={style}
      href={value}
      onClick={(event) => {
        if (isSafe) return;
        if (confirm("Are you sure to open this link?\n" + url)) return;
        event.preventDefault();
      }}
      target="_blank"
      rel="noopener noreferrer"
      title={tooltip}
    >
      <Button.Outline
        as="div"
        icon={<Icon width="20" height="20" />}
        color="secondary"
        size="extraSmall"
        circular
      />
    </Link>
  );
}

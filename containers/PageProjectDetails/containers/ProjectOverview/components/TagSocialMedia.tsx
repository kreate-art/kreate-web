import * as React from "react";

import IconFacebook from "../icons/IconFacebook";
import IconLinkedIn from "../icons/IconLinkedIn";
import IconReddit from "../icons/IconReddit";
import IconTelegram from "../icons/IconTelegram";
import IconTwitter from "../icons/IconTwitter";

import styles from "./TagSocialMedia.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  socialMedia: string;
  projectLink: string;
};

function getSocialMediaInfo(socialMedia: string) {
  switch (socialMedia) {
    case "facebook":
      return {
        icon: <IconFacebook />,
        sharerLink: "https://www.facebook.com/sharer/sharer.php?u=",
        name: "Facebook",
      };
    case "twitter":
      return {
        icon: <IconTwitter />,
        sharerLink: "https://twitter.com/intent/tweet?text=",
        name: "Twitter",
      };
    case "telegram":
      return {
        icon: <IconTelegram />,
        sharerLink: "https://t.me/share/url?url=",
        name: "Telegram",
      };
    case "linkedIn":
      return {
        icon: <IconLinkedIn />,
        sharerLink: "https://www.linkedin.com/sharing/share-offsite/?url=",
        name: "LinkedIn",
      };
    case "reddit":
      return {
        icon: <IconReddit />,
        sharerLink: "https://www.reddit.com/submit?url=",
        name: "Reddit",
      };
    default:
      return {
        icon: null,
        sharerLink: null,
        name: null,
      };
  }
}

// TODO: Better naming?
export default function TagSocialMedia({ socialMedia, projectLink }: Props) {
  const { icon, sharerLink, name } = getSocialMediaInfo(socialMedia);
  return (
    <div className={styles.container}>
      <a
        className={styles.button}
        onClick={() => {
          const navUrl = sharerLink + encodeURIComponent(projectLink);
          window.open(navUrl, "_blank");
        }}
      >
        {icon}
      </a>
      <Typography.Span
        content={name}
        style={{ marginTop: "16px" }}
        size="heading6"
      />
    </div>
  );
}

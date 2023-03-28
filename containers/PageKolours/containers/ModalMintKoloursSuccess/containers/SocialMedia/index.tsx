import cx from "classnames";

import IconReddit from "../../icons/IconReddit";
import IconTelegram from "../../icons/IconTelegram";
import IconTwitter from "../../icons/IconTwitter";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  shareValue: string;
};

export default function SocialMedia({
  className,
  style,
  value,
  shareValue,
}: Props) {
  const { icon, sharerLink } = getSocialMediaInfo(value);
  const navUrl = sharerLink + encodeURIComponent(shareValue);
  return (
    <div className={cx(styles.container, className)} style={style}>
      <a href={navUrl} target="_blank" rel="noreferrer">
        <div className={styles.iconContainer}>{icon}</div>
      </a>
    </div>
  );
}

// Copied from PageProjectDetails/containers/ProjectOverview/components/TagSocialMedia.tsx
function getSocialMediaInfo(socialMedia: string) {
  switch (socialMedia) {
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

import IconDiscord from "./icons/IconDiscord";
import IconFacebook from "./icons/IconFacebook";
import IconGithub from "./icons/IconGithub";
import IconInstagram from "./icons/IconInstagram";
import IconLinkedin from "./icons/IconLinkedin";
import IconMedium from "./icons/IconMedium";
import IconPinterest from "./icons/IconPinterest";
import IconReddit from "./icons/IconReddit";
import IconSnapchat from "./icons/IconSnapchat";
import IconTelegram from "./icons/IconTelegram";
import IconTwitch from "./icons/IconTwitch";
import IconTwitter from "./icons/IconTwitter";
import IconYoutube from "./icons/IconYoutube";

type KnownSocialChannel = {
  key: React.Key;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  domains: string[];
  tooltip: string;
};

export const knownSocialChannels: KnownSocialChannel[] = [
  {
    key: "discord",
    icon: IconDiscord,
    domains: ["discord.gg", "discord.com", "discord.io"],
    tooltip: "Discord",
  },
  {
    key: "facebook",
    icon: IconFacebook,
    domains: ["facebook.com", "fb.com", "fb.gg", "fb.me"],
    tooltip: "Facebook",
  },
  {
    key: "github",
    icon: IconGithub,
    domains: ["ghcr.io", "github.com", "github.io"],
    tooltip: "Github",
  },
  {
    key: "instagram",
    icon: IconInstagram,
    domains: ["ig.me", "instagram.com"],
    tooltip: "Instagram",
  },
  {
    key: "linkedin",
    icon: IconLinkedin,
    domains: ["linkedin.at", "linkedin.cn", "linkedin.com", "lnkd.in"],
    tooltip: "Linkedin",
  },
  {
    key: "medium",
    icon: IconMedium,
    domains: ["medium.com"],
    tooltip: "Medium",
  },
  {
    key: "pinterest",
    icon: IconPinterest,
    domains: ["pin.it", "pinimg.com", "pinterest.com"],
    tooltip: "Pinterest",
  },
  {
    key: "reddit",
    icon: IconReddit,
    domains: ["redd.it", "reddit.com"],
    tooltip: "Reddit",
  },
  {
    key: "snapchat",
    icon: IconSnapchat,
    domains: ["snapchat.com"],
    tooltip: "Snapchat",
  },
  {
    key: "telegram",
    icon: IconTelegram,
    domains: ["t.me", "telegram.me", "telegram.org"],
    tooltip: "Telegram",
  },
  {
    key: "twitch",
    icon: IconTwitch,
    domains: ["twitch.tv"],
    tooltip: "Twitch",
  },
  {
    key: "twitter",
    icon: IconTwitter,
    domains: ["t.co", "twitter.com"],
    tooltip: "Twitter",
  },
  {
    key: "youtube",
    icon: IconYoutube,
    domains: ["youtube.com", "youtu.be", "yt.be"],
    tooltip: "Youtube",
  },
];

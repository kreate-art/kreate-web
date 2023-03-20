import IconDiscord from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconDiscord";
import IconFacebook from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconFacebook";
import IconGithub from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconGithub";
import IconInstagram from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconInstagram";
import IconLink from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconLink";
import IconLinkedIn from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconLinkedin";
import IconMedium from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconMedium";
import IconPinterest from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconPinterest";
import IconReddit from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconReddit";
import IconSnapchat from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconSnapchat";
import IconTelegram from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconTelegram";
import IconTwitter from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconTwitter";
import IconYoutube from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel/icons/IconYoutube";

const matcher: {
  key: string;
  icon: React.ReactNode;
  pattern: RegExp;
  prefixUrl: string;
}[] = [
  {
    key: "Facebook",
    icon: <IconFacebook />,
    pattern: /^https:\/\/(www\.)?facebook\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "facebook.com",
  },
  {
    key: "Twitter",
    icon: <IconTwitter />,
    pattern: /^https:\/\/(www\.)?twitter\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "twitter.com",
  },
  {
    key: "Instagram",
    icon: <IconInstagram />,
    pattern: /^https:\/\/(www\.)?instagram\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "instagram.com",
  },
  {
    key: "Youtube",
    icon: <IconYoutube />,
    pattern: /^https:\/\/(www\.)?youtube\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "youtube.com",
  },
  {
    key: "Telegram",
    icon: <IconTelegram />,
    pattern: /^https:\/\/(www\.)?telegram\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "t.me",
  },
  {
    key: "Discord",
    icon: <IconDiscord />,
    pattern: /^https:\/\/(www\.)?discord\.gg\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "discord.gg",
  },
  {
    key: "Reddit",
    icon: <IconReddit />,
    pattern:
      /^https:\/\/(www\.)?reddit\.com\/(?:r\/|u\/)[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "reddit.com/r",
  },
  {
    key: "Github",
    icon: <IconGithub />,
    pattern: /^https:\/\/(www\.)?github\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "github.com",
  },
  {
    key: "Medium",
    icon: <IconMedium />,
    pattern: /^https:\/\/(www\.)?medium\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "medium.com",
  },
  {
    key: "Linkedin",
    icon: <IconLinkedIn />,
    pattern: /^https:\/\/(www\.)?linkedin\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "linkedin.com",
  },
  {
    key: "Twitch",
    icon: "twitch",
    pattern: /^https:\/\/(www\.)?twitch\.tv\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "twitch.tv",
  },
  {
    key: "Pinterest",
    icon: <IconPinterest />,
    pattern: /^https:\/\/(www\.)?pinterest\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "pinterest.com",
  },
  {
    key: "Snapchat",
    icon: <IconSnapchat />,
    pattern: /^https:\/\/(www\.)?snapchat\.com\/[0-9a-zA-Z._-]*(\/)?$/i,
    prefixUrl: "snapchat.com",
  },
];

const getUrlInfo = (url: string) => {
  const name =
    url.split("/").pop() == ""
      ? url.split("/")[url.split("/").length - 2]
      : url.split("/").pop();
  for (const { prefixUrl, icon, pattern } of matcher) {
    if (pattern.exec(url)) {
      return { prefixUrl: prefixUrl, icon: icon, name: name };
    }
  }
  return { prefixUrl: "", icon: <IconLink />, name: url };
};

export { getUrlInfo };

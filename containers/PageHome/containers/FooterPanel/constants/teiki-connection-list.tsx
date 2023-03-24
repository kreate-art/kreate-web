import * as React from "react";

import IconDiscord from "./components/IconDiscord";
import IconGithub from "./components/IconGithub";
import IconTelegram from "./components/IconTelegram";
import IconTwitter from "./components/IconTwitter";

export const TEIKI_CONNECTION_LIST: {
  icon: React.ReactNode;
  url: string;
}[] = [
  {
    icon: <IconDiscord />,
    url: "https://discord.gg/kreate",
  },
  {
    icon: <IconTwitter />,
    url: "https://twitter.com/KreatePlatform",
  },
  {
    icon: <IconTelegram />,
    url: "https://t.me/kreate_announcement",
  },
  {
    icon: <IconGithub />,
    url: "https://github.com/kreate-community",
  },
];

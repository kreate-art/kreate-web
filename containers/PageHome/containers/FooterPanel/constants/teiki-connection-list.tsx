import * as React from "react";

import IconDiscord from "./components/IconDiscord";
import IconGithub from "./components/IconGithub";
import IconReddit from "./components/IconReddit";
import IconTelegram from "./components/IconTelegram";
import IconTwitter from "./components/IconTwitter";

export const TEIKI_CONNECTION_LIST: {
  icon: React.ReactNode;
  url: string;
}[] = [
  {
    icon: <IconGithub />,
    url: "https://github.com/teiki-network",
  },
  {
    icon: <IconDiscord />,
    url: "https://discord.io/teikinetwork",
  },
  {
    icon: <IconTwitter />,
    url: "https://twitter.com/TeikiNetwork",
  },
  {
    icon: <IconTelegram />,
    url: "https://t.me/teiki_network",
  },
];

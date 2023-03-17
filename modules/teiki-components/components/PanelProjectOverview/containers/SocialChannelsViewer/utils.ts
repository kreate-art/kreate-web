import { knownSocialChannels } from "./config";
import IconLink from "./icons/IconLink";

type Url = string;

type Entry = {
  url: Url;
  isSafe: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tooltip: string;
};

/**
 * Returns the hostname (after protocol, before path, without port)
 *
 * Example: `https://kreate.community:8080/about-us` -> `kreate.community`
 *
 * If `url` is invalid, returns `null`.
 */
function extractHostName(url: Url): string | null {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch {
    return null; // invalid url
  }
}

export function formatToEntry(url: Url): Entry {
  // To support user inputs like `twitter.com/kreate`
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const hostname = extractHostName(url);
  if (!hostname) return { url, isSafe: false, icon: IconLink, tooltip: url };

  for (const rule of knownSocialChannels) {
    for (const domain of rule.domains) {
      if (hostname === domain || hostname.endsWith("." + domain)) {
        return { url, isSafe: true, icon: rule.icon, tooltip: rule.tooltip };
      }
    }
  }
  return { url, isSafe: false, icon: IconLink, tooltip: url };
}

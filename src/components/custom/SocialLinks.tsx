// Utils

// Types
import type { LucideIcon } from "lucide-react";

// Components
import { Twitter, Youtube } from "lucide-react";
type SocialLinkProps = {
  url: string;
  Icon: LucideIcon;
  name: string;
};

const socialLinks: SocialLinkProps[] = [
  {
    url: "https://twitter.com/udogtracker",
    Icon: Twitter,
    name: "Twitter",
  },
  {
    url: "https://www.youtube.com/@UnderdogTracker",
    Icon: Youtube,
    name: "Youtube",
  },
];

const SocialLinks = () => {
  return socialLinks.map(({ url, Icon, name }) => (
    <div key={url} className="social-link">
      <a href={url} title={name} target="_blank">
        <Icon className="h-6 w-6 fill-inherit" />
      </a>
    </div>
  ));
};

export default SocialLinks;

import type { IconType } from "@icons-pack/react-simple-icons";
import {
  SiFacebook as FacebookIcon,
  SiGithub as GithubIcon,
  SiGmail as GmailIcon,
  SiInstagram as InstagramIcon,
  SiLinkedin as LinkedinIcon,
  SiTelegram as TelegramIcon,
  SiTiktok as TiktokIcon,
} from "@icons-pack/react-simple-icons";
import type { LucideProps } from "lucide-react";
import {
  AtSignIcon,
  BanknoteIcon,
  BookMarkedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  CircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  FileIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  LanguagesIcon,
  MapPinIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { default as TikLogo } from "./tik-logo";

export const icons = {
  AtSign: AtSignIcon,
  Banknote: BanknoteIcon,
  BookMarked: BookMarkedIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  ChevronsUpDown: ChevronsUpDownIcon,
  Circle: CircleIcon,
  Clock: ClockIcon,
  ExternalLink: ExternalLinkIcon,
  File: FileIcon,
  Facebook: FacebookIcon,
  Github: GithubIcon,
  Gmail: GmailIcon,
  HelpCircle: HelpCircleIcon,
  Image: ImageIcon,
  Inbox: InboxIcon,
  Instagram: InstagramIcon,
  Languages: LanguagesIcon,
  Linkedin: LinkedinIcon,
  MapPin: MapPinIcon,
  Menu: MenuIcon,
  Telegram: TelegramIcon,
  TikLogo,
  Tiktok: TiktokIcon,
  X: XIcon,
} as const;

export {
  AtSignIcon,
  BanknoteIcon,
  BookMarkedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  CircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  FacebookIcon,
  FileIcon,
  GithubIcon,
  GmailIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  MapPinIcon,
  MenuIcon,
  TelegramIcon,
  TikLogo,
  TiktokIcon,
  XIcon,
};

export type IconName = keyof typeof icons;

type RenderIconProps = {
  name: IconName;
} & (LucideProps | React.ComponentProps<IconType>);

export function RenderIcon({ name, ...props }: RenderIconProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
  const IconComponent = icons[name] ?? icons.HelpCircle;
  return <IconComponent {...props} />;
}

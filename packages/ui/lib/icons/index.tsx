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
import type { LucideProps, LucideIcon } from "lucide-react";
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  AtSignIcon,
  BanknoteIcon,
  BookMarkedIcon,
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  CircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  FileIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  LanguagesIcon,
  MapPinIcon,
  MegaphoneIcon,
  MenuIcon,
  MoreHorizontalIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { default as TikLogo } from "./tik-logo";

export const icons = {
  AlertOctagon: AlertOctagonIcon,
  AlertTriangle: AlertTriangleIcon,
  AtSign: AtSignIcon,
  Banknote: BanknoteIcon,
  BookMarked: BookMarkedIcon,
  BriefcaseBusiness: BriefcaseBusinessIcon,
  ChevronDown: ChevronDownIcon,
  Chevronleft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  ChevronsUpDown: ChevronsUpDownIcon,
  ChevronUp: ChevronUpIcon,
  Circle: CircleIcon,
  Clock: ClockIcon,
  ExternalLink: ExternalLinkIcon,
  Facebook: FacebookIcon,
  File: FileIcon,
  Github: GithubIcon,
  Gmail: GmailIcon,
  HelpCircle: HelpCircleIcon,
  Image: ImageIcon,
  Inbox: InboxIcon,
  Instagram: InstagramIcon,
  Languages: LanguagesIcon,
  Linkedin: LinkedinIcon,
  MapPin: MapPinIcon,
  Megaphone: MegaphoneIcon,
  Menu: MenuIcon,
  MoreHorizontal: MoreHorizontalIcon,
  Telegram: TelegramIcon,
  TikLogo,
  Tiktok: TiktokIcon,
  X: XIcon,
} as const;

export {
  AlertOctagonIcon,
  AlertTriangleIcon,
  AtSignIcon,
  BanknoteIcon,
  BookMarkedIcon,
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
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
  MegaphoneIcon,
  MenuIcon,
  MoreHorizontalIcon,
  TelegramIcon,
  TikLogo,
  TiktokIcon,
  XIcon,
};

export type { LucideIcon };

export type IconName = keyof typeof icons;

type RenderIconProps = {
  name: IconName;
} & (LucideProps | React.ComponentProps<IconType>);

export function RenderIcon({ name, ...props }: RenderIconProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
  const IconComponent = icons[name] ?? icons.HelpCircle;
  return <IconComponent {...props} />;
}

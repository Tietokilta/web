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
import {
  type LucideProps,
  type LucideIcon,
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
  GavelIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  LanguagesIcon,
  MapPinIcon,
  MegaphoneIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { default as TikLogo } from "./tik-logo";
import NavGuildIcon from "./nav/guild";
import NavFuksisIcon from "./nav/fuksis";
import NavCompaniesIcon from "./nav/companies";
import NavEventsIcon from "./nav/events";
import NavApplicantsIcon from "./nav/applicants";

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
  Gavel: GavelIcon,
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
  Phone: PhoneIcon,
  Telegram: TelegramIcon,
  TikLogo,
  Tiktok: TiktokIcon,
  X: XIcon,
  NavGuild: NavGuildIcon,
  NavFuksis: NavFuksisIcon,
  NavCompanies: NavCompaniesIcon,
  NavEvents: NavEventsIcon,
  NavApplicants: NavApplicantsIcon,
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
  GavelIcon,
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
  PhoneIcon,
  TelegramIcon,
  TikLogo,
  TiktokIcon,
  XIcon,
  NavGuildIcon,
  NavFuksisIcon,
  NavCompaniesIcon,
  NavEventsIcon,
  NavApplicantsIcon,
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

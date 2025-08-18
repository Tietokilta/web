import type { IconProps } from "@phosphor-icons/react";
import {
  FacebookLogoIcon as FacebookIcon,
  GithubLogoIcon as GithubIcon,
  InstagramLogoIcon as InstagramIcon,
  LinkedinLogoIcon as LinkedinIcon,
  TelegramLogoIcon as TelegramIcon,
  TiktokLogoIcon as TiktokIcon,
} from "@phosphor-icons/react/ssr";
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
  MailIcon,
  MapPinIcon,
  MegaphoneIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  SendIcon,
  XIcon,
  HandshakeIcon,
} from "lucide-react";
import type { JSX } from "react";
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
  /** @deprecated use `ChevronLeft` */
  Chevronleft: ChevronLeftIcon,
  ChevronLeft: ChevronLeftIcon,
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
  /** @deprecated use `Mail` */
  Gmail: MailIcon,
  HelpCircle: HelpCircleIcon,
  Image: ImageIcon,
  Inbox: InboxIcon,
  Instagram: InstagramIcon,
  Languages: LanguagesIcon,
  Linkedin: LinkedinIcon,
  Mail: MailIcon,
  MapPin: MapPinIcon,
  Megaphone: MegaphoneIcon,
  Menu: MenuIcon,
  MoreHorizontal: MoreHorizontalIcon,
  PaperAirplane: SendIcon,
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
  Handshake: HandshakeIcon,
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
  /** @deprecated use `MailIcon` */
  MailIcon as GmailIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  MegaphoneIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  SendIcon,
  TelegramIcon,
  TikLogo,
  TiktokIcon,
  XIcon,
  NavGuildIcon,
  NavFuksisIcon,
  NavCompaniesIcon,
  NavEventsIcon,
  NavApplicantsIcon,
  HandshakeIcon,
};

export type { LucideIcon };

export type IconName = keyof typeof icons;

type RenderIconProps = {
  name: IconName;
} & (LucideProps | IconProps);

export function RenderIcon({ name, ...props }: RenderIconProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
  const IconComponent = icons[name] ?? icons.HelpCircle;
  return <IconComponent {...props} />;
}

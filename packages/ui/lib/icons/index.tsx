import { default as TikLogo } from "./TikLogo";

import {
  SiFacebook as FacebookIcon,
  SiGithub as GithubIcon,
  SiInstagram as InstagramIcon,
  SiLinkedin as LinkedinIcon,
  SiTelegram as TelegramIcon,
  SiTiktok as TiktokIcon,
} from "@icons-pack/react-simple-icons";
import {
  AtSignIcon,
  BanknoteIcon,
  BookMarkedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  CircleIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  LanguagesIcon,
  LucideProps,
  MenuIcon,
  XIcon,
} from "lucide-react";
import React from "react";

import type { IconType } from "@icons-pack/react-simple-icons/types";

export const icons = {
  AtSign: AtSignIcon,
  Banknote: BanknoteIcon,
  BookMarked: BookMarkedIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  ChevronsUpDown: ChevronsUpDownIcon,
  Circle: CircleIcon,
  Facebook: FacebookIcon,
  Github: GithubIcon,
  HelpCircle: HelpCircleIcon,
  Image: ImageIcon,
  Inbox: InboxIcon,
  Instagram: InstagramIcon,
  Languages: LanguagesIcon,
  Linkedin: LinkedinIcon,
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
  FacebookIcon,
  GithubIcon,
  HelpCircleIcon,
  ImageIcon,
  InboxIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
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

export const RenderIcon = ({ name, ...props }: RenderIconProps) => {
  const IconComponent = icons[name] ?? icons.HelpCircle;
  return <IconComponent {...props} />;
};

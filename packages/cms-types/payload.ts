/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export type LinkRowBlockLink =
  | {
      icon:
        | 'AtSign'
        | 'Banknote'
        | 'BookMarked'
        | 'ChevronDown'
        | 'ChevronUp'
        | 'ChevronsUpDown'
        | 'Circle'
        | 'ExternalLink'
        | 'Facebook'
        | 'Github'
        | 'HelpCircle'
        | 'Image'
        | 'Inbox'
        | 'Instagram'
        | 'Languages'
        | 'Linkedin'
        | 'Menu'
        | 'Telegram'
        | 'TikLogo'
        | 'Tiktok'
        | 'X';
      label: string;
      linkType?: ('external' | 'internal') | null;
      url?: string | null;
      page?: (string | null) | Page;
      id?: string | null;
    }[]
  | null;
export type MainNavigationItem = {
  type?: ('page' | 'topic') | null;
  pageConfig?: {
    page: string | Page;
  };
  topicConfig?: MainNavigationTopicConfig;
  id?: string | null;
}[];

export interface Config {
  collections: {
    users: User;
    pages: Page;
    media: Media;
    topics: Topic;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    footer: Footer;
    'landing-page': LandingPage;
    'main-navigation': MainNavigation;
  };
}
export interface User {
  id: string;
  sub?: string | null;
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface Page {
  id: string;
  title: string;
  content: {
    root: {
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      type: string;
      version: number;
    };
    [k: string]: unknown;
  };
  path?: string | null;
  topic?: {
    relationTo: 'topics';
    value: string | Topic;
  } | null;
  slug: string;
  hidden: boolean;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
export interface Topic {
  id: string;
  title: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
}
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
export interface Footer {
  id: string;
  layout: (LinkRowBlock | SponsorLogoRowBlock)[];
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface LinkRowBlock {
  showLabel: boolean;
  links?: LinkRowBlockLink;
  id?: string | null;
  blockName?: string | null;
  blockType: 'link-row';
}
export interface SponsorLogoRowBlock {
  logos?:
    | {
        image: string | Media;
        link: string;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'logo-row';
}
export interface LandingPage {
  id: string;
  heroText: string;
  heroImages: {
    image?: (string | null) | Media;
    id?: string | null;
  }[];
  body: {
    root: {
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      type: string;
      version: number;
    };
    [k: string]: unknown;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface MainNavigation {
  id: string;
  items: MainNavigationItem;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface MainNavigationTopicConfig {
  topic: string | Topic;
  categories?:
    | {
        title: string;
        pages?:
          | {
              page: string | Page;
              id?: string | null;
            }[]
          | null;
        externalLinks?:
          | {
              title: string;
              href: string;
              icon:
                | 'AtSign'
                | 'Banknote'
                | 'BookMarked'
                | 'ChevronDown'
                | 'ChevronUp'
                | 'ChevronsUpDown'
                | 'Circle'
                | 'ExternalLink'
                | 'Facebook'
                | 'Github'
                | 'HelpCircle'
                | 'Image'
                | 'Inbox'
                | 'Instagram'
                | 'Languages'
                | 'Linkedin'
                | 'Menu'
                | 'Telegram'
                | 'TikLogo'
                | 'Tiktok'
                | 'X';
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
}

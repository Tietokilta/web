/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export type MainNavigationItem = {
  type?: ('page' | 'topic') | null;
  pageConfig?: {
    page: string | Page;
  };
  topicConfig?: MainNavigationTopicConfig;
  id?: string | null;
}[];
export type LinkRowBlockLink =
  | {
      icon: 'PhotographOutline' | 'CashOutline' | 'BookmarkAltOutline';
      label: string;
      linkType?: ('external' | 'internal') | null;
      url?: string | null;
      page?: (string | null) | Page;
      id?: string | null;
    }[]
  | null;

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
    'main-navigation': MainNavigation;
    'landing-page': LandingPage;
    footer: Footer;
  };
}
export interface User {
  id: string;
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
    [k: string]: unknown;
  }[];
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
              icon: 'PhotographOutline' | 'CashOutline' | 'BookmarkAltOutline';
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
}
export interface LandingPage {
  id: string;
  heroText: string;
  heroImages: {
    image?: (string | null) | Media;
    id?: string | null;
  }[];
  body: {
    [k: string]: unknown;
  }[];
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface Footer {
  id: string;
  layout: (LinkRowBlock | LogoRowBlock)[];
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
export interface LogoRowBlock {
  logos?:
    | {
        image: string | Media;
        link?: string | null;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'logo-row';
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
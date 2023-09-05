/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export type MainNavigationItem = {
  type?: 'page' | 'topic';
  pageConfig?: {
    page: string | Page;
  };
  topicConfig?: MainNavigationTopicConfig;
  id?: string;
}[];

export interface Config {
  collections: {
    users: User;
    pages: Page;
    media: Media;
    topics: Topic;
  };
  globals: {
    'main-navigation': MainNavigation;
  };
}
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface Page {
  id: string;
  title: string;
  content: {
    [k: string]: unknown;
  }[];
  path?: string;
  topic?: {
    value: string | Topic;
    relationTo: 'topics';
  };
  slug: string;
  hidden: boolean;
  updatedAt: string;
  createdAt: string;
  _status?: 'draft' | 'published';
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
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}
export interface MainNavigation {
  id: string;
  items: MainNavigationItem;
  updatedAt?: string;
  createdAt?: string;
}
export interface MainNavigationTopicConfig {
  topic: string | Topic;
  categories: {
    title: string;
    pages?: {
      page: string | Page;
      id?: string;
    }[];
    externalLinks?: {
      title: string;
      href: string;
      icon: 'PhotographOutline' | 'CashOutline' | 'BookmarkAltOutline';
      id?: string;
    }[];
    id?: string;
  }[];
}

/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "LinkRowBlockLink".
 */
export type LinkRowBlockLink =
  | {
      icon:
        | 'AlertOctagon'
        | 'AlertTriangle'
        | 'AtSign'
        | 'Banknote'
        | 'BookMarked'
        | 'BriefcaseBusiness'
        | 'ChevronDown'
        | 'Chevronleft'
        | 'ChevronRight'
        | 'ChevronsUpDown'
        | 'ChevronUp'
        | 'Circle'
        | 'Clock'
        | 'ExternalLink'
        | 'Facebook'
        | 'File'
        | 'Gavel'
        | 'Github'
        | 'Gmail'
        | 'HelpCircle'
        | 'Image'
        | 'Inbox'
        | 'Instagram'
        | 'Languages'
        | 'Linkedin'
        | 'Mail'
        | 'MapPin'
        | 'Megaphone'
        | 'Menu'
        | 'MoreHorizontal'
        | 'PaperAirplane'
        | 'Phone'
        | 'Telegram'
        | 'TikLogo'
        | 'Tiktok'
        | 'X'
        | 'NavGuild'
        | 'NavFuksis'
        | 'NavCompanies'
        | 'NavEvents'
        | 'NavApplicants'
        | 'Handshake';
      label: string;
      linkType?: ('external' | 'internal') | null;
      url?: string | null;
      page?: (string | null) | Page;
      id?: string | null;
    }[]
  | null;
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "MainNavigationItem".
 */
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
    documents: Document;
    topics: Topic;
    'board-members': BoardMember;
    boards: Board;
    'committee-members': CommitteeMember;
    committees: Committee;
    'magazine-issues': MagazineIssue;
    magazines: Magazine;
    news: News;
    'weekly-newsletters': WeeklyNewsletter;
    'news-items': NewsItem;
    honors: Honor;
    'awarded-honors': AwardedHonor;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    footer: Footer;
    'landing-page': LandingPage;
    'main-navigation': MainNavigation;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
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
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  title: string;
  description: string;
  type: 'standard' | 'redirect' | 'events-list' | 'all-events-list' | 'weekly-newsletter' | 'weekly-newsletters-list';
  icon?:
    | (
        | 'AlertOctagon'
        | 'AlertTriangle'
        | 'AtSign'
        | 'Banknote'
        | 'BookMarked'
        | 'BriefcaseBusiness'
        | 'ChevronDown'
        | 'Chevronleft'
        | 'ChevronRight'
        | 'ChevronsUpDown'
        | 'ChevronUp'
        | 'Circle'
        | 'Clock'
        | 'ExternalLink'
        | 'Facebook'
        | 'File'
        | 'Gavel'
        | 'Github'
        | 'Gmail'
        | 'HelpCircle'
        | 'Image'
        | 'Inbox'
        | 'Instagram'
        | 'Languages'
        | 'Linkedin'
        | 'Mail'
        | 'MapPin'
        | 'Megaphone'
        | 'Menu'
        | 'MoreHorizontal'
        | 'PaperAirplane'
        | 'Phone'
        | 'Telegram'
        | 'TikLogo'
        | 'Tiktok'
        | 'X'
        | 'NavGuild'
        | 'NavFuksis'
        | 'NavCompanies'
        | 'NavEvents'
        | 'NavApplicants'
        | 'Handshake'
      )
    | null;
  tableOfContents?: ('all' | 'top-level' | 'none') | null;
  content?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  redirectToPage?: (string | null) | Page;
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
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "topics".
 */
export interface Topic {
  id: string;
  title: string;
  slug: string;
  icon?:
    | (
        | 'AlertOctagon'
        | 'AlertTriangle'
        | 'AtSign'
        | 'Banknote'
        | 'BookMarked'
        | 'BriefcaseBusiness'
        | 'ChevronDown'
        | 'Chevronleft'
        | 'ChevronRight'
        | 'ChevronsUpDown'
        | 'ChevronUp'
        | 'Circle'
        | 'Clock'
        | 'ExternalLink'
        | 'Facebook'
        | 'File'
        | 'Gavel'
        | 'Github'
        | 'Gmail'
        | 'HelpCircle'
        | 'Image'
        | 'Inbox'
        | 'Instagram'
        | 'Languages'
        | 'Linkedin'
        | 'Mail'
        | 'MapPin'
        | 'Megaphone'
        | 'Menu'
        | 'MoreHorizontal'
        | 'PaperAirplane'
        | 'Phone'
        | 'Telegram'
        | 'TikLogo'
        | 'Tiktok'
        | 'X'
        | 'NavGuild'
        | 'NavFuksis'
        | 'NavCompanies'
        | 'NavEvents'
        | 'NavApplicants'
        | 'Handshake'
      )
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  photographer?: string | null;
  mediaType?: ('image' | 'logo') | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "documents".
 */
export interface Document {
  id: string;
  title?: string | null;
  thumbnail?: string | Media | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "board-members".
 */
export interface BoardMember {
  id: string;
  guildYear:
    | '2024'
    | '2023'
    | '2022'
    | '2021'
    | '2020'
    | '2019'
    | '2018'
    | '2017'
    | '2016'
    | '2015'
    | '2014'
    | '2013'
    | '2012'
    | '2011'
    | '2010'
    | '2009'
    | '2008'
    | '2007'
    | '2006'
    | '2005'
    | '2004'
    | '2003'
    | '2002'
    | '2001'
    | '2000'
    | '1999'
    | '1998'
    | '1997'
    | '1996'
    | '1995'
    | '1994'
    | '1993'
    | '1992'
    | '1991'
    | '1990'
    | '1989'
    | '1988'
    | '1987'
    | '1986';
  photo?: (string | null) | Media;
  name: string;
  title: string;
  email?: string | null;
  telegram?: string | null;
  phoneNumber?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "boards".
 */
export interface Board {
  id: string;
  year:
    | '2024'
    | '2023'
    | '2022'
    | '2021'
    | '2020'
    | '2019'
    | '2018'
    | '2017'
    | '2016'
    | '2015'
    | '2014'
    | '2013'
    | '2012'
    | '2011'
    | '2010'
    | '2009'
    | '2008'
    | '2007'
    | '2006'
    | '2005'
    | '2004'
    | '2003'
    | '2002'
    | '2001'
    | '2000'
    | '1999'
    | '1998'
    | '1997'
    | '1996'
    | '1995'
    | '1994'
    | '1993'
    | '1992'
    | '1991'
    | '1990'
    | '1989'
    | '1988'
    | '1987'
    | '1986';
  groupPhoto?: (string | null) | Media;
  boardMembers: {
    boardMember?: (string | null) | BoardMember;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "committee-members".
 */
export interface CommitteeMember {
  id: string;
  displayTitle?: string | null;
  guildYear:
    | '2024'
    | '2023'
    | '2022'
    | '2021'
    | '2020'
    | '2019'
    | '2018'
    | '2017'
    | '2016'
    | '2015'
    | '2014'
    | '2013'
    | '2012'
    | '2011'
    | '2010'
    | '2009'
    | '2008'
    | '2007'
    | '2006'
    | '2005'
    | '2004'
    | '2003'
    | '2002'
    | '2001'
    | '2000'
    | '1999'
    | '1998'
    | '1997'
    | '1996'
    | '1995'
    | '1994'
    | '1993'
    | '1992'
    | '1991'
    | '1990'
    | '1989'
    | '1988'
    | '1987'
    | '1986';
  photo?: (string | null) | Media;
  name: string;
  title: string;
  chair?: boolean | null;
  telegramUsername?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "committees".
 */
export interface Committee {
  id: string;
  year:
    | '2024'
    | '2023'
    | '2022'
    | '2021'
    | '2020'
    | '2019'
    | '2018'
    | '2017'
    | '2016'
    | '2015'
    | '2014'
    | '2013'
    | '2012'
    | '2011'
    | '2010'
    | '2009'
    | '2008'
    | '2007'
    | '2006'
    | '2005'
    | '2004'
    | '2003'
    | '2002'
    | '2001'
    | '2000'
    | '1999'
    | '1998'
    | '1997'
    | '1996'
    | '1995'
    | '1994'
    | '1993'
    | '1992'
    | '1991'
    | '1990'
    | '1989'
    | '1988'
    | '1987'
    | '1986';
  name: string;
  committeeMembers: {
    committeeMember?: (string | null) | CommitteeMember;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "magazine-issues".
 */
export interface MagazineIssue {
  id: string;
  title?: string | null;
  year:
    | '2024'
    | '2023'
    | '2022'
    | '2021'
    | '2020'
    | '2019'
    | '2018'
    | '2017'
    | '2016'
    | '2015'
    | '2014'
    | '2013'
    | '2012'
    | '2011'
    | '2010'
    | '2009'
    | '2008'
    | '2007'
    | '2006'
    | '2005'
    | '2004'
    | '2003'
    | '2002'
    | '2001'
    | '2000'
    | '1999'
    | '1998'
    | '1997'
    | '1996'
    | '1995'
    | '1994'
    | '1993'
    | '1992'
    | '1991'
    | '1990'
    | '1989'
    | '1988'
    | '1987'
    | '1986';
  issueNumber: number;
  file: string | Document;
  thumbnail: string | Media;
  name?: string | null;
  textIssueNumber?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "magazines".
 */
export interface Magazine {
  id: string;
  type: 'Alkorytmi' | 'Rekrylehti';
  issues?:
    | {
        issue?: (string | null) | MagazineIssue;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "news".
 */
export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  ctaType: 'none' | 'news' | 'page' | 'external';
  pageLink?: (string | null) | Page;
  externalLink?: string | null;
  type?: ('announcement' | 'warning' | 'danger') | null;
  author: string | User;
  content: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "weekly-newsletters".
 */
export interface WeeklyNewsletter {
  id: string;
  title: string;
  greetings: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  newsItems?:
    | {
        newsItem: string | NewsItem;
        id?: string | null;
      }[]
    | null;
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "news-items".
 */
export interface NewsItem {
  id: string;
  displayTitle?: string | null;
  title: string;
  newsItemCategory: 'guild' | 'ayy-aalto' | 'other' | 'bottom-corner';
  date?: string | null;
  signupStartDate?: string | null;
  signupEndDate?: string | null;
  linkToSignUp?: string | null;
  content: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "honors".
 */
export interface Honor {
  id: string;
  name: string;
  awardedHonors: {
    awardedHonor?: (string | null) | AwardedHonor;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "awarded-honors".
 */
export interface AwardedHonor {
  id: string;
  displayTitle?: string | null;
  guildYear:
    | '2024'
    | '2023'
    | '2022'
    | '2021'
    | '2020'
    | '2019'
    | '2018'
    | '2017'
    | '2016'
    | '2015'
    | '2014'
    | '2013'
    | '2012'
    | '2011'
    | '2010'
    | '2009'
    | '2008'
    | '2007'
    | '2006'
    | '2005'
    | '2004'
    | '2003'
    | '2002'
    | '2001'
    | '2000'
    | '1999'
    | '1998'
    | '1997'
    | '1996'
    | '1995'
    | '1994'
    | '1993'
    | '1992'
    | '1991'
    | '1990'
    | '1989'
    | '1988'
    | '1987'
    | '1986';
  name: string;
  description?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
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
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "footer".
 */
export interface Footer {
  id: string;
  layout: (LinkRowBlock | SponsorLogoRowBlock)[];
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "LinkRowBlock".
 */
export interface LinkRowBlock {
  showLabel: boolean;
  links?: LinkRowBlockLink;
  id?: string | null;
  blockName?: string | null;
  blockType: 'link-row';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "SponsorLogoRowBlock".
 */
export interface SponsorLogoRowBlock {
  title: string;
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
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "landing-page".
 */
export interface LandingPage {
  id: string;
  heroTexts: {
    text?: string | null;
    id?: string | null;
  }[];
  heroImages: {
    image?: (string | null) | Media;
    id?: string | null;
  }[];
  eventsListPage: string | Page;
  announcement?: (string | null) | News;
  body: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "main-navigation".
 */
export interface MainNavigation {
  id: string;
  logo: string | Media;
  items: MainNavigationItem;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "MainNavigationTopicConfig".
 */
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
                | 'AlertOctagon'
                | 'AlertTriangle'
                | 'AtSign'
                | 'Banknote'
                | 'BookMarked'
                | 'BriefcaseBusiness'
                | 'ChevronDown'
                | 'Chevronleft'
                | 'ChevronRight'
                | 'ChevronsUpDown'
                | 'ChevronUp'
                | 'Circle'
                | 'Clock'
                | 'ExternalLink'
                | 'Facebook'
                | 'File'
                | 'Gavel'
                | 'Github'
                | 'Gmail'
                | 'HelpCircle'
                | 'Image'
                | 'Inbox'
                | 'Instagram'
                | 'Languages'
                | 'Linkedin'
                | 'Mail'
                | 'MapPin'
                | 'Megaphone'
                | 'Menu'
                | 'MoreHorizontal'
                | 'PaperAirplane'
                | 'Phone'
                | 'Telegram'
                | 'TikLogo'
                | 'Tiktok'
                | 'X'
                | 'NavGuild'
                | 'NavFuksis'
                | 'NavCompanies'
                | 'NavEvents'
                | 'NavApplicants'
                | 'Handshake';
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
}

import type { Board, Committee, Media, Page } from "./payload";

type BaseNode = {
  version: number;
  type: string;
  children?: Node[];
  [k: string]: unknown;
};

type BaseTextNode = BaseNode & {
  indent: number;
  direction: Page["content"]["root"]["direction"];
  format: Page["content"]["root"]["format"];
};

export type TextNode = Omit<BaseTextNode, "format"> & {
  type: "text";
  detail: number;
  format: number;
  mode: "normal";
  style: "";
  text: string;
};

export type ParagraphNode = BaseTextNode & {
  type: "paragraph";
  children: Node[];
};

export type HeadingNode = BaseTextNode & {
  type: "heading";
  tag: "h2" | "h3";
  children: Node[];
};

export type ListNode = {
  type: "list";
  start: number;
  children: Node[];
} & (
  | {
      listType: "number";
      tag: "ol";
    }
  | {
      listType: "bullet";
      tag: "ul";
    }
);

export type QuoteNode = BaseTextNode & {
  type: "quote";
  children: Node[];
};

export type UploadNode = BaseNode & {
  type: "upload";
  relationTo: "media";
  value: Media;
  fields?: {
    caption?: string;
  } | null;
};

export type ListItemNode = BaseTextNode & {
  type: "listitem";
  value: number;
  children: Node[];
};

export type LinkNode = BaseTextNode & {
  type: "link";
  fields: {
    url: string;
    newTab: boolean;
  } & (
    | {
        linkType: "internal";
        doc: {
          value: Page;
        };
      }
    | {
        linkType: "custom";
      }
  );
};

export type AutoLinkNode = BaseTextNode & {
  type: "autolink";
  fields: {
    linkType: "custom";
    url: string;
  };
};

export type LinebreakNode = {
  type: "linebreak";
  version: number;
};

export type PageRelationshipNode = BaseNode & {
  type: "relationship";
  relationTo: "pages";
  value: Page;
};

export type BoardRelationshipNode = BaseNode & {
  type: "relationship";
  relationTo: "boards";
  value: Board;
};

export type CommitteeRelationshipNode = BaseNode & {
  type: "relationship";
  relationTo: "committees";
  value: Committee;
};

export type RelationshipNode =
  | PageRelationshipNode
  | BoardRelationshipNode
  | CommitteeRelationshipNode;

export type Node =
  | TextNode
  | ParagraphNode
  | HeadingNode
  | ListNode
  | QuoteNode
  | UploadNode
  | RelationshipNode
  | ListItemNode
  | LinkNode
  | AutoLinkNode
  | LinebreakNode;

export type RootNode = {
  type: "root";
  format: Page["content"]["root"]["format"];
  indent: Page["content"]["root"]["indent"];
  version: Page["content"]["root"]["version"];
  children: Node[];
};

export type EditorState = {
  root: RootNode;
};

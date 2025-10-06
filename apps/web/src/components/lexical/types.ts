import {
  type Board,
  type Committee,
  type Honor,
  type Magazine,
  type Media,
  type Partner,
  type Page,
  type Document,
} from "@payload-types";

interface BaseNode {
  version: number;
  type: string;
  children?: Node[];
  [k: string]: unknown;
}

type BaseTextNode = BaseNode & {
  indent: number;
  direction: NonNullable<Page["content"]>["root"]["direction"];
  format: NonNullable<Page["content"]>["root"]["format"];
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

export type MediaUploadNode = BaseNode & {
  type: "upload";
  relationTo: "media";
  value: Media;
  fields?: {
    caption?: string;
  } | null;
};

export type DocumentUploadNode = BaseNode & {
  type: "upload";
  relationTo: "documents";
  value: Document;
  fields?: Record<string, never> | null;
};

export type UploadNode = MediaUploadNode | DocumentUploadNode;

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

export interface LinebreakNode {
  type: "linebreak";
  version: number;
}

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

export type MagazineRelationshipNode = BaseNode & {
  type: "relationship";
  relationTo: "magazines";
  value: Magazine;
};

export type HonorsRelationshipNode = BaseNode & {
  type: "relationship";
  relationTo: "honors";
  value: Honor;
};

export type RelationshipNode =
  | PageRelationshipNode
  | BoardRelationshipNode
  | CommitteeRelationshipNode
  | MagazineRelationshipNode
  | HonorsRelationshipNode;

export interface BaseBlockFields {
  id: string;
  blockName: string;
}

export interface BaseBlockNode {
  format: NonNullable<Page["content"]>["root"]["format"];
  type: "block";
}

export type CommitteesYearBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "committees-in-year";
    year: string;
  };
};

export type ImageLinkGridBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "image-link-grid";
    size: "small" | "medium" | "large";
    images: {
      image: Media;
      caption?: string | null | undefined;
      externalLink?: string | null | undefined;
    }[];
  };
};

export type GoogleFormBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "google-form";
    link: string;
  };
};

export type HighlightCardBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "highlight-card";
    content: EditorState;
    another: number;
  };
};

export type EditorInChiefBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "editor-in-chief";
    name: string;
    type: string;
  };
};

export type InvoiceGeneratorBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "invoice-generator";
  };
};

export type PartnersBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "partners";
    size: "small" | "medium" | "large";
    types: Exclude<Partner["status"], "inactive">[];
  };
};

export type CollapsibleBlockNode = BaseBlockNode & {
  fields: BaseBlockFields & {
    blockType: "collapsible";
    header: string;
    content: EditorState;
  };
};

export type BlockNode =
  | CommitteesYearBlockNode
  | ImageLinkGridBlockNode
  | GoogleFormBlockNode
  | HighlightCardBlockNode
  | EditorInChiefBlockNode
  | InvoiceGeneratorBlockNode
  | PartnersBlockNode
  | CollapsibleBlockNode;

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
  | LinebreakNode
  | BlockNode;

export interface RootNode {
  type: "root";
  format: NonNullable<Page["content"]>["root"]["format"];
  indent: NonNullable<Page["content"]>["root"]["indent"];
  version: NonNullable<Page["content"]>["root"]["version"];
  children: Node[];
}

export interface EditorState {
  root: RootNode;
}

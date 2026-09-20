import type {
  SerializedAutoLinkNode,
  SerializedBlockNode,
  SerializedHeadingNode,
  SerializedLineBreakNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedRelationshipNode,
  SerializedTextNode,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type {
  CollapsibleBlock,
  ColumnsBlock,
  CommitteesInYearBlock,
  EditorInChiefBlock,
  GoogleFormBlock,
  HighlightCardBlock,
  ImageLinkGridBlock,
  InvoiceGeneratorBlock,
  PartnersBlock,
  Page,
} from "@payload-types";

export type TextNode = SerializedTextNode;
/** Interfaces allow the recursive children to use our complete node union. */
export interface ParagraphNode extends SerializedParagraphNode<Node> {}
export interface HeadingNode extends SerializedHeadingNode<Node> {}
export interface ListNode extends SerializedListNode<Node> {}
export interface ListItemNode extends SerializedListItemNode<Node> {}
export interface QuoteNode extends SerializedQuoteNode<Node> {}
export type LinebreakNode = SerializedLineBreakNode;
export interface AutoLinkNode extends SerializedAutoLinkNode<Node> {}

/**
 * Removes document IDs from each member of a node union, preserving its
 * collection-specific document type.
 *
 * Renderer inputs assume populated documents through sufficient fetch depth and
 * casts at call sites. This helper does not validate population at runtime.
 */
type PopulatedNode<T> = T extends { value: infer Value }
  ? Omit<T, "value"> & { value: Exclude<Value, string | number> }
  : never;

/** Only pages can be selected as internal links in our editor. */
export interface LinkNode extends Omit<SerializedLinkNode<Node>, "fields"> {
  fields: Pick<SerializedLinkNode["fields"], "newTab" | "url"> &
    (
      | { linkType: "internal"; doc: { relationTo: "pages"; value: Page } }
      | { linkType: "custom" }
    );
}

export type MediaUploadNode = Omit<
  PopulatedNode<Extract<SerializedUploadNode, { relationTo: "media" }>>,
  "fields"
> & {
  fields?: { caption?: string | null } | null;
};
export type DocumentUploadNode = PopulatedNode<
  Extract<SerializedUploadNode, { relationTo: "documents" }>
>;
export type UploadNode = MediaUploadNode | DocumentUploadNode;

export type RelationshipNode = PopulatedNode<
  Extract<
    SerializedRelationshipNode,
    { relationTo: "pages" | "boards" | "committees" | "magazines" | "honors" }
  >
>;

export type CommitteesYearBlockNode =
  SerializedBlockNode<CommitteesInYearBlock>;
export type GoogleFormBlockNode = SerializedBlockNode<GoogleFormBlock>;
export type EditorInChiefBlockNode = SerializedBlockNode<EditorInChiefBlock>;
export type InvoiceGeneratorBlockNode =
  SerializedBlockNode<InvoiceGeneratorBlock>;
export type PartnersBlockNode = SerializedBlockNode<PartnersBlock>;

/** Replaces generated rich-text JSON with the node union used by our renderers. */
type WithEditorState<T extends { content: unknown }> = Omit<T, "content"> & {
  content: EditorState;
};

export type HighlightCardBlockNode = SerializedBlockNode<
  WithEditorState<HighlightCardBlock>
>;
export type CollapsibleBlockNode = SerializedBlockNode<
  WithEditorState<CollapsibleBlock>
>;
export type ColumnsBlockNode = SerializedBlockNode<
  Omit<ColumnsBlock, "columns"> & {
    columns: WithEditorState<ColumnsBlock["columns"][number]>[];
  }
>;

/** Grid images follow the same populated-document assumption as upload nodes. */
type PopulatedGridImage = Omit<
  NonNullable<ImageLinkGridBlock["images"]>[number],
  "image"
> & {
  image: Exclude<
    NonNullable<ImageLinkGridBlock["images"]>[number]["image"],
    string
  >;
};

export type ImageLinkGridBlockNode = SerializedBlockNode<
  Omit<ImageLinkGridBlock, "images"> & {
    images?: PopulatedGridImage[] | null;
  }
>;

export type BlockNode =
  | CommitteesYearBlockNode
  | ImageLinkGridBlockNode
  | GoogleFormBlockNode
  | HighlightCardBlockNode
  | EditorInChiefBlockNode
  | InvoiceGeneratorBlockNode
  | PartnersBlockNode
  | CollapsibleBlockNode
  | ColumnsBlockNode;

/** Supplies our node union directly so children stay typed at any nesting depth. */
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

export type EditorState = SerializedEditorState<Node>;
export type RootNode = EditorState["root"];

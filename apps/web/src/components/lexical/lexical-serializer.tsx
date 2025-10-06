/* eslint-disable react/no-array-index-key -- okay here */
/* eslint-disable no-bitwise -- lexical nodes are defined bitwise */
import { FileIcon } from "@tietokilta/ui";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import type { BlockNode, Node, RelationshipNode } from "@lexical-types";
import { type Media } from "@payload-types";
import { PartnerLogos } from "@components/partner-logos";
import { HighlightCard } from "@components/highlight-card";
import {
  cn,
  insertSoftHyphens,
  lexicalNodeToTextContent,
  makeUniqueId,
  stringToId,
} from "../../lib/utils";
import { BoardGrid } from "../board-grid";
import { CommitteeCard } from "../committee-card";
import { CommitteeList } from "../committee-list";
import { MagazineList } from "../magazine-list";
import { HonorsList } from "../honors-list";
import { ImageLinkGrid } from "../image-link-grid";
import { GoogleForm } from "../google-form";
import { EditorInChief } from "../editor-in-chief";
import { InvoiceGenerator } from "../invoice-generator";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./rich-text-node-format";

export function LexicalSerializer({
  nodes,
}: {
  nodes: Node[];
}): React.ReactNode {
  const seenIds = new Map<string, number>();
  return (
    <>
      {nodes.map((node, index): JSX.Element | null => (
        <LexicalNodeSerializer key={index} node={node} seenIds={seenIds} />
      ))}
    </>
  );
}

function LexicalNodeSerializer({
  node,
  seenIds,
}: {
  node: Node | undefined | null;
  seenIds: Map<string, number>;
}): React.ReactNode {
  if (node === null || node === undefined) {
    return null;
  }
  if (node.type === "text") {
    let text = <span>{insertSoftHyphens(node.text)}</span>;
    if (node.format & IS_BOLD) {
      text = <strong>{text}</strong>;
    }
    if (node.format & IS_ITALIC) {
      text = <em>{text}</em>;
    }
    if (node.format & IS_STRIKETHROUGH) {
      text = <span className="line-through">{text}</span>;
    }
    if (node.format & IS_UNDERLINE) {
      text = <span className="underline">{text}</span>;
    }
    if (node.format & IS_CODE) {
      text = <code>{text}</code>;
    }
    if (node.format & IS_SUBSCRIPT) {
      text = <sub>{text}</sub>;
    }
    if (node.format & IS_SUPERSCRIPT) {
      text = <sup>{text}</sup>;
    }

    return text;
  }

  const serializedChildren =
    "children" in node && node.children ? (
      <LexicalSerializer nodes={node.children} />
    ) : null;

  switch (node.type) {
    case "linebreak": {
      return <br />;
    }
    case "paragraph": {
      const allowedPTypes = ["text", "link", "autolink", "linebreak"];
      const hasAllowedChildren = (n: Node): boolean => {
        if (!("children" in n)) return true;
        const children = n.children as Node[];
        if (children.length === 0) return true;
        return children.every(
          (child) =>
            allowedPTypes.includes(child.type) ||
            (child.type === "upload" && !child.showCaption) ||
            hasAllowedChildren(child),
        );
      };
      const ParagraphTag = hasAllowedChildren(node) ? "p" : "div";
      return (
        <ParagraphTag
          className={cn(
            node.indent === 1 && "ml-[4ch]",
            node.indent === 2 && "ml-[8ch]",
            node.indent === 3 && "ml-[12ch]",
            node.indent === 4 && "ml-[16ch]",
            node.indent === 5 && "ml-[20ch]",

            node.format === "left" && "text-left",
            node.format === "center" && "text-center",
            node.format === "right" && "text-right",
          )}
        >
          {serializedChildren}
        </ParagraphTag>
      );
    }
    case "heading": {
      type Heading = Extract<
        keyof JSX.IntrinsicElements,
        "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
      >;
      const Tag = node.tag as Heading;
      const baseId = stringToId(lexicalNodeToTextContent(node));
      const uniqueId = makeUniqueId(baseId, seenIds);

      return (
        <Link href={`#${uniqueId}`}>
          <Tag id={uniqueId}>{serializedChildren}</Tag>
        </Link>
      );
    }
    case "list": {
      type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
      const Tag: List = node.tag;
      return (
        <Tag className={node.listType as string}>{serializedChildren}</Tag>
      );
    }
    case "listitem": {
      const nestedList =
        node.children.length === 1 && node.children[0].type === "list";

      return (
        <li className={cn(nestedList && "list-none")} value={node.value}>
          {serializedChildren}
        </li>
      );
    }
    case "quote": {
      return <blockquote>{serializedChildren}</blockquote>;
    }
    case "link": {
      const fields = node.fields;
      if (fields.linkType === "internal") {
        return (
          <Link
            href={fields.doc.value.path ?? "#no-path"}
            target={fields.newTab ? "_blank" : undefined}
          >
            {serializedChildren}
          </Link>
        );
      }

      const newTabProps = fields.newTab
        ? {
            target: "_blank",
            rel: "noopener",
          }
        : {};

      return (
        <a href={fields.url} {...newTabProps}>
          {serializedChildren}
        </a>
      );
    }
    case "autolink": {
      return (
        <a href={node.fields.url} rel="noopener" target="_blank">
          {serializedChildren}
        </a>
      );
    }
    case "upload": {
      const uploadIsMedia = node.relationTo === "media";

      if (uploadIsMedia) {
        const img = (
          <Image
            alt={node.value.alt}
            height={node.value.height ?? 0}
            src={node.value.url ?? "#broken-url"}
            width={node.value.width ?? 0}
          />
        );

        if (!node.fields?.caption) return img;

        return (
          <figure>
            {img}
            <figcaption>
              <span>{node.fields.caption}</span>
            </figcaption>
          </figure>
        );
      }

      const thumbnail = node.value.thumbnail as Media | undefined;

      return (
        <a
          href={node.value.url ?? "#broken-url"}
          target="_blank"
          className="not-prose hover:bg-gray-300/90 my-4 flex w-fit max-w-full items-center gap-4 text-clip rounded-md border-2 border-gray-900 p-4 shadow-solid hover:border-gray-800"
          rel="noopener"
        >
          <div className="flex max-w-full flex-col items-center gap-2">
            {thumbnail ? (
              <div className="relative h-40 w-32">
                <Image
                  alt={thumbnail.alt}
                  src={thumbnail.url ?? "#broken-url"}
                  fill
                  className="object-contain object-center"
                />
              </div>
            ) : (
              <FileIcon className="size-6" />
            )}
            {node.value.title ? (
              <p className="w-full font-mono font-semibold">
                {node.value.title}
              </p>
            ) : null}
          </div>
        </a>
      );
    }
    case "relationship": {
      return <Relationship node={node} />;
    }
    case "block": {
      return <Block node={node} />;
    }
    default:
      // eslint-disable-next-line no-console -- Nice to know if something is missing
      console.warn("Unknown node:", node);
      return null;
  }
}

function Relationship({ node }: { node: RelationshipNode }) {
  switch (node.relationTo) {
    case "pages": {
      return (
        <Link
          className="not-prose hover:bg-gray-300/90 my-4 flex w-fit items-center gap-4 rounded-md border-2 border-gray-900 p-4 shadow-solid hover:border-gray-800"
          data-relation
          href={node.value.path ?? "#no-path"}
        >
          <FileIcon className="size-6" />
          <p className="flex flex-col">
            <span className="font-mono font-semibold">{node.value.title}</span>
            <span className="line-clamp-2 max-w-80 text-sm text-gray-700">
              {node.value.description}
            </span>
          </p>
        </Link>
      );
    }
    case "boards": {
      return <BoardGrid board={node.value} />;
    }
    case "committees": {
      return <CommitteeCard isTightLayout committee={node.value} />;
    }
    case "magazines": {
      return <MagazineList magazine={node.value} />;
    }
    case "honors": {
      return <HonorsList honor={node.value} />;
    }
    default: {
      // @ts-expect-error -- Extra safety for unknown relationTo since we're casting types and there may be some bogus relationships
      // eslint-disable-next-line no-console -- Nice to know if something is missing
      console.warn("Unknown relationTo:", node.relationTo);
      return null;
    }
  }
}

function Block({ node }: { node: BlockNode }) {
  switch (node.fields.blockType) {
    case "committees-in-year": {
      return <CommitteeList year={node.fields.year} />;
    }
    case "image-link-grid": {
      return (
        <ImageLinkGrid images={node.fields.images} size={node.fields.size} />
      );
    }
    case "google-form": {
      return <GoogleForm link={node.fields.link} />;
    }
    case "highlight-card": {
      return (
        <HighlightCard
          content={node.fields.content}
          Renderer={LexicalSerializer}
        />
      );
    }
    case "editor-in-chief": {
      return <EditorInChief name={node.fields.name} type={node.fields.type} />;
    }
    case "invoice-generator": {
      return <InvoiceGenerator />;
    }
    case "partners": {
      return (
        <PartnerLogos statuses={node.fields.types} size={node.fields.size} />
      );
    }
    default: {
      // @ts-expect-error -- Extra safety for unknown blockType since we're casting types and there may be some bogus blocks
      // eslint-disable-next-line no-console -- Nice to know if something is missing
      console.warn("Unknown blockType:", node.fields.blockType);
      return null;
    }
  }
}

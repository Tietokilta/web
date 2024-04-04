/* eslint-disable react/no-array-index-key -- okay here */
/* eslint-disable no-bitwise -- lexical nodes are defined bitwise */
import type {
  BlockNode,
  Node,
  RelationshipNode,
} from "@tietokilta/cms-types/lexical";
import { FileIcon } from "@tietokilta/ui";
import Image from "next/image";
import Link from "next/link";
import { cn, lexicalNodeToTextContent, stringToId } from "../../lib/utils";
import { BoardGrid } from "../board-grid";
import { CommitteeCard } from "../committee-card";
import { CommitteeList } from "../committee-list";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./rich-text-node-format";

export function LexicalSerializer({ nodes }: { nodes: Node[] }): JSX.Element {
  return (
    <>
      {nodes.map((node, index): JSX.Element | null => {
        if (node.type === "text") {
          let text = <span key={index}>{node.text}</span>;
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>;
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>;
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span className="line-through" key={index}>
                {text}
              </span>
            );
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span className="underline" key={index}>
                {text}
              </span>
            );
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{text}</code>;
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>;
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>;
          }

          return text;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- null check
        if (node === null || node === undefined) {
          return null;
        }

        const serializedChildren =
          "children" in node && node.children ? (
            <LexicalSerializer nodes={node.children} />
          ) : null;

        switch (node.type) {
          case "linebreak": {
            return <br key={index} />;
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
                key={index}
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

            return (
              <Tag id={stringToId(lexicalNodeToTextContent(node))} key={index}>
                {serializedChildren}
              </Tag>
            );
          }
          case "list": {
            type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
            const Tag: List = node.tag;
            return (
              <Tag className={node.listType as string} key={index}>
                {serializedChildren}
              </Tag>
            );
          }
          case "listitem": {
            return (
              <li key={index} value={node.value}>
                {serializedChildren}
              </li>
            );
          }
          case "quote": {
            return <blockquote key={index}>{serializedChildren}</blockquote>;
          }
          case "link": {
            const fields = node.fields;
            if (fields.linkType === "internal") {
              return (
                <Link
                  href={fields.doc.value.path ?? "#no-path"}
                  key={index}
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
              <a href={fields.url} key={index} {...newTabProps}>
                {serializedChildren}
              </a>
            );
          }
          case "autolink": {
            return (
              <a
                href={node.fields.url}
                key={index}
                rel="noopener"
                target="_blank"
              >
                {serializedChildren}
              </a>
            );
          }
          case "upload": {
            const img = (
              <Image
                alt={node.value.alt}
                height={node.value.height ?? 0}
                key={index}
                src={node.value.url ?? "#broken-url"}
                width={node.value.width ?? 0}
              />
            );

            if (!node.fields?.caption) return img;

            return (
              <figure key={index}>
                {img}
                <figcaption>
                  <span>{node.fields.caption}</span>
                </figcaption>
              </figure>
            );
          }
          case "relationship": {
            return <Relationship key={index} node={node} />;
          }
          case "block": {
            return <Block key={index} node={node} />;
          }
          default:
            // eslint-disable-next-line no-console -- Nice to know if something is missing
            console.warn("Unknown node:", node);
            return null;
        }
      })}
    </>
  );
}

function Relationship({ node }: { node: RelationshipNode }) {
  switch (node.relationTo) {
    case "pages": {
      return (
        <Link
          className="not-prose shadow-solid my-4 flex w-fit items-center gap-4 rounded-md border-2 border-gray-900 p-4 hover:border-gray-800 hover:bg-gray-300/90"
          data-relation
          href={node.value.path ?? "#no-path"}
        >
          <FileIcon className="h-6 w-6" />
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
      return <CommitteeCard committee={node.value} />;
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
    default: {
      // eslint-disable-next-line no-console -- Nice to know if something is missing
      console.warn("Unknown blockType:", node.fields.blockType);
      return null;
    }
  }
}

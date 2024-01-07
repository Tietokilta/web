/* eslint-disable react/no-array-index-key -- okay here */
/* eslint-disable no-bitwise -- lexical nodes are defined bitwise */
import Link from "next/link";
import { Fragment } from "react";
import { lexicalNodeToTextContent } from "../../lib/utils";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./rich-text-node-format";
import type {
  SerializedLexicalEditorState,
  SerializedLexicalNode,
} from "./types";

export function LexicalSerializer({
  nodes,
}: {
  nodes: SerializedLexicalNode[];
}): JSX.Element {
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
        if (node === null) {
          return null;
        }

        const serializedChildren = node.children && (
          <LexicalSerializer nodes={node.children} />
        );

        switch (node.type) {
          case "tab": {
            return <span key={index}>&emsp;</span>;
          }
          case "linebreak": {
            return <br key={index} />;
          }
          case "paragraph": {
            const allowedPTypes = ["text", "link", "linebreak"];
            const hasAllowedChildren = (n: SerializedLexicalNode): boolean =>
              !n.children ||
              n.children.every(
                (child) =>
                  allowedPTypes.includes(child.type) ||
                  (child.type === "upload" && !child.showCaption) ||
                  (child.type === "mark" && hasAllowedChildren(child)),
              );
            const ParagraphTag = hasAllowedChildren(node) ? "p" : "div";
            return (
              <ParagraphTag key={index}>{serializedChildren}</ParagraphTag>
            );
          }
          case "heading": {
            type Heading = Extract<
              keyof JSX.IntrinsicElements,
              "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
            >;
            const Tag = node.tag as Heading;

            return (
              <Tag
                id={lexicalNodeToTextContent(node)
                  .toLocaleLowerCase()
                  .replace(/\s/g, "-")}
                key={index}
              >
                {serializedChildren}
              </Tag>
            );
          }
          case "list": {
            type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
            const Tag = node.tag as List;
            return (
              <Tag className={node.listType as string} key={index}>
                {serializedChildren}
              </Tag>
            );
          }
          case "listitem": {
            if (node.checked !== null) {
              return (
                <li
                  aria-checked={node.checked ? "true" : "false"}
                  className={`component--list-item-checkbox ${
                    node.checked
                      ? "component--list-item-checkbox-checked"
                      : "component--list-item-checked-unchecked"
                  }`}
                  key={index}
                  role="checkbox"
                  tabIndex={-1}
                  value={node.value as string}
                >
                  {serializedChildren}
                </li>
              );
            }
            return (
              <li key={index} value={node.value as string}>
                {serializedChildren}
              </li>
            );
          }
          case "quote": {
            return <blockquote key={index}>{serializedChildren}</blockquote>;
          }
          case "link": {
            const fields = node.fields as {
              doc?: { value: { path?: string } };
              linkType?: "custom" | "internal";
              newTab?: boolean;
              nofollow?: boolean;
              rel?: string;
              sponsored?: boolean;
              url?: string;
            };

            if (fields.linkType === "custom") {
              const rel = `${fields.rel ?? ""} ${
                fields.nofollow ? " nofollow" : ""
              }`;
              return (
                <a
                  href={fields.url}
                  key={index}
                  rel={rel}
                  target={fields.newTab ? "_blank" : undefined}
                >
                  {serializedChildren}
                </a>
              );
            } else if (fields.linkType === "internal") {
              return (
                <Link
                  href={fields.doc?.value.path ?? "#no-path"}
                  key={index}
                  target={fields.newTab ? "_blank" : undefined}
                >
                  {serializedChildren}
                </Link>
              );
            }
            break;
          }
          case "youtube": {
            return (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${
                  node.videoID as string
                }`}
                title={node.title as string}
              />
            );
          }
          case "upload": {
            const data = node.data as {
              url: string;
              width: number;
              height: number;
              alt: string;
            };
            const img = (
              // eslint-disable-next-line @next/next/no-img-element -- TODO: set up next/image later
              <img
                alt={data.alt}
                height={data.height}
                key={index}
                src={data.url}
                width={data.width}
              />
            );
            return node.showCaption ? (
              <figure key={index}>
                {img}
                <figcaption>
                  <LexicalSerializer
                    nodes={
                      (
                        node.caption as {
                          editorState: SerializedLexicalEditorState;
                        }
                      ).editorState.root.children
                    }
                  />
                </figcaption>
              </figure>
            ) : (
              img
            );
          }
          case "mark": {
            return <Fragment key={index}>{serializedChildren}</Fragment>;
          }
          default:
            // eslint-disable-next-line no-console -- Nice to know if something is missing
            console.warn("Unknown node:", node);
            return null;
        }

        return null;
      })}
    </>
  );
}

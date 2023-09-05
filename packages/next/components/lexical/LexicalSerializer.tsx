import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
} from "./RichTextNodeFormat";

import Link from "next/link";
import { Fragment } from "react";

import type {
  SerializedLexicalEditorState,
  SerializedLexicalNode,
} from "./types";

interface Props {
  nodes: SerializedLexicalNode[];
}

export function LexicalSerializer({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
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
              <span key={index} className="line-through">
                {text}
              </span>
            );
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} className="underline">
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

        if (node === null) {
          return null;
        }

        const serializedChildren = node.children && (
          <LexicalSerializer nodes={node.children} />
        );

        switch (node.type) {
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
            const Tag = node?.tag as Heading;
            return <Tag key={index}>{serializedChildren}</Tag>;
          }
          case "list": {
            type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
            const Tag = node?.tag as List;
            return (
              <Tag key={index} className={node?.listType as string}>
                {serializedChildren}
              </Tag>
            );
          }
          case "listitem": {
            if (node?.checked !== null) {
              return (
                <li
                  key={index}
                  className={`component--list-item-checkbox ${
                    node.checked
                      ? "component--list-item-checkbox-checked"
                      : "component--list-item-checked-unchecked"
                  }`}
                  value={node?.value as string}
                  role="checkbox"
                  aria-checked={node.checked ? "true" : "false"}
                  tabIndex={-1}
                >
                  {serializedChildren}
                </li>
              );
            } else {
              return (
                <li key={index} value={node?.value as string}>
                  {serializedChildren}
                </li>
              );
            }
          }
          case "quote": {
            return <blockquote key={index}>{serializedChildren}</blockquote>;
          }
          case "link": {
            const attributes = node.attributes as {
              doc?: { data: { path?: string } };
              linkType?: "custom" | "internal";
              newTab?: boolean;
              nofollow?: boolean;
              rel?: string;
              sponsored?: boolean;
              url?: string;
            };

            if (attributes.linkType === "custom") {
              const rel = `${attributes?.rel ?? ""} ${
                attributes?.nofollow ? " nofollow" : ""
              }`;
              return (
                <a
                  key={index}
                  href={attributes.url}
                  target={attributes.newTab ? "_blank" : undefined}
                  rel={rel}
                >
                  {serializedChildren}
                </a>
              );
            } else if (attributes.linkType === "internal") {
              return (
                <Link
                  href={attributes.doc?.data.path ?? "#no-path"}
                  target={attributes.newTab ? "_blank" : undefined}
                  key={index}
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.url}
                width={data.width}
                height={data.height}
                alt={data.alt}
                key={index}
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
            // eslint-disable-next-line no-console
            console.warn("Unknown node:", node);
            return null;
        }

        return null;
      })}
    </Fragment>
  );
}

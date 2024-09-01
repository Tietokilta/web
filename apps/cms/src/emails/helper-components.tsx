import * as React from "react";
import { type Media, type NewsItem } from "@tietokilta/cms-types/payload";
import { type EditorState, type Node } from "@tietokilta/cms-types/lexical";
import { cn, FileIcon } from "@tietokilta/ui";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "web/src/components/lexical/rich-text-node-format";
import { Link } from "@react-email/components";
import {
  formatDate,
  insertSoftHyphens,
  lexicalNodeToTextContent,
  stringToId,
  type TocItem,
} from "web/src/lib/utils";
import { type GetDateTimeFormatterOptions } from "../lib/utils";

export function Greetings({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <div className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      <LexicalSerializer nodes={content.root.children} />
    </div>
  );
}

export function LexicalSerializer({ nodes }: { nodes: Node[] }): JSX.Element {
  return (
    <>
      {nodes.map((node, index): JSX.Element | null => {
        if (node.type === "text") {
          let text = <span key={index}>{insertSoftHyphens(node.text)}</span>;
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
              <Link href={`#${stringToId(lexicalNodeToTextContent(node))}`}>
                <Tag
                  id={stringToId(lexicalNodeToTextContent(node))}
                  key={index}
                >
                  {serializedChildren}
                </Tag>
              </Link>
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
            const uploadIsMedia = node.relationTo === "media";

            if (uploadIsMedia) {
              const img = (
                <img
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

            const thumbnail = node.value.thumbnail as Media | undefined;

            return (
              <Link
                href={node.value.url ?? "#broken-url"}
                key={index}
                target="_blank"
                className="not-prose shadow-solid my-4 flex w-fit max-w-full items-center gap-4 text-clip rounded-md border-2 border-gray-900 p-4 hover:border-gray-800 hover:bg-gray-300/90"
              >
                <div className="flex max-w-full flex-col items-center gap-2">
                  {thumbnail ? (
                    <div className="relative h-40 w-32">
                      <img
                        alt={thumbnail.alt}
                        src={thumbnail.url ?? "#broken-url"}
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
              </Link>
            );
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
function NewsItemContent({
  item,
  locale,
}: {
  item: NewsItem;
  locale: "en" | "fi";
}) {
  const content = item.content as unknown as EditorState | null;
  const t = {
    en: {
      "for-event": "for event",
      "link-to-sign-up": "To sign up",
    },
    fi: {
      "for-event": "tapahtumalle",
      "link-to-sign-up": "Ilmoittautumiseen",
    },
  };
  return (
    <div className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      {item.linkToSignUp ? (
        <Link
          // Do not create relative links
          href={
            item.linkToSignUp.startsWith("http")
              ? item.linkToSignUp
              : `//${item.linkToSignUp}`
          }
          target="_blank"
          rel="noopener"
        >
          {t[locale]["link-to-sign-up"]}{" "}
          <span className="sr-only">{` ${t[locale]["for-event"]} ${item.title}`}</span>
        </Link>
      ) : null}
      {content ? <LexicalSerializer nodes={content.root.children} /> : null}
    </div>
  );
}

function NewsSection({
  newsItem,
  locale,
}: {
  newsItem: NewsItem;
  locale: "en" | "fi";
}) {
  return (
    <article>
      <h3 id={stringToId(newsItem.title)}>{newsItem.title}</h3>
      <NewsItemContent item={newsItem} locale={locale} />
    </article>
  );
}

export function NewsletterCategory({
  title,
  newsItems,
  locale,
}: {
  title: string;
  newsItems: NewsItem[];
  locale: "en" | "fi";
}) {
  if (newsItems.length === 0) return null;

  return (
    <section className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      <h2 className="font-mono text-2xl" id={stringToId(title)}>
        {title}
      </h2>
      {newsItems.map((newsItem) => (
        <NewsSection key={newsItem.id} newsItem={newsItem} locale={locale} />
      ))}
    </section>
  );
}

export function Calendar({
  eventsThisWeek,
  eventsNextWeek,
  signupsThisWeek,
  locale,
}: {
  eventsThisWeek: NewsItem[];
  eventsNextWeek: NewsItem[];
  signupsThisWeek: NewsItem[];
  locale: "en" | "fi";
}) {
  if (
    eventsThisWeek.length === 0 &&
    eventsNextWeek.length === 0 &&
    signupsThisWeek.length === 0
  ) {
    return null;
  }
  const t = {
    en: {
      calendar: "Calendar",
      "next-week": "Next week",
      "this-week-signups": "Sign ups open this week",
      "this-week": "This week",
    },
    fi: {
      calendar: "Kalenteri",
      "next-week": "Ensi viikolla",
      "this-week": "Tällä viikolla",
      "this-week-signups": "Tällä viikolla avoinna olevat ilmoittautumiset",
    },
  };
  return (
    <section className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      <h2 id={stringToId(t[locale].calendar)}>{t[locale].calendar}</h2>
      {eventsThisWeek.length > 0 ? (
        <div>
          <span>{t[locale]["this-week"]}:</span>
          <ol className="not-prose ml-[4ch]">
            {eventsThisWeek.map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.date ? (
                  <span>{formatDate(newsItem.date)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {eventsNextWeek.length > 0 ? (
        <div>
          <span>{t[locale]["next-week"]}:</span>
          <ol className="not-prose ml-[4ch]">
            {eventsNextWeek.map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.date ? (
                  <span>{formatDate(newsItem.date)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {signupsThisWeek.length > 0 ? (
        <div>
          <span>{t[locale]["this-week-signups"]}:</span>
          <ol className="not-prose ml-[4ch]">
            {signupsThisWeek.map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.signupStartDate ? (
                  <span>{formatDate(newsItem.signupStartDate)}</span>
                ) : null}
                {newsItem.signupEndDate ? (
                  <span>–{formatDate(newsItem.signupEndDate)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

interface SharedProps {
  defaultFormattedDate: string;
  rawDate: string;
  formatOptions: GetDateTimeFormatterOptions;
}
type TimeProps = SharedProps &
  Omit<React.HTMLProps<HTMLTimeElement>, "dateTime"> & {
    as?: "time";
  };
type SpanProps = SharedProps &
  React.HTMLProps<HTMLSpanElement> & {
    as?: "span";
  };
type Props = TimeProps | SpanProps;

export function DateTime({
  defaultFormattedDate,
  rawDate,
  as = "time",
  ...rest
}: Props) {
  const Component = as;

  return (
    <Component
      dateTime={as === "time" && rawDate ? rawDate : undefined}
      {...rest}
    >
      {defaultFormattedDate}
    </Component>
  );
}

function HeadingList({ toc }: { toc: TocItem[] }): React.ReactElement {
  return (
    <ol>
      {toc.map((item: { level: number; text: string }) => (
        <li
          className={cn(
            "before:text-gray-600",
            item.level === 2 &&
              "before:content-alt-empty mb-2 ms-[2ch] text-base before:-ms-[2ch] before:me-[1ch] before:content-['#'] last:mb-0",
            item.level === 3 &&
              "before:content-alt-empty mb-1 ms-[3ch] text-sm before:-ms-[3ch] before:me-[1ch] before:content-['##'] last:mb-0",
          )}
          key={`${item.level.toFixed()}-${item.text}`}
        >
          {insertSoftHyphens(item.text)}
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({ toc }: { toc?: TocItem[] }) {
  if (!toc || toc.length === 0) return null;

  return <HeadingList toc={toc} />;
}

/* eslint-disable no-bitwise -- lexical nodes are defined bitwise*/
import { type NewsItem } from "@tietokilta/cms-types/payload";
import { type EditorState, type Node } from "@tietokilta/cms-types/lexical";
import { Link } from "@react-email/components";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./utils/lexical";
import {
  byDate,
  formatDate,
  insertSoftHyphens,
  lexicalNodeToTextContent,
  stringToId,
  type TocItem,
} from "./utils/utils";

export function Greetings({
  content,
}: {
  content?: EditorState;
}): JSX.Element | null {
  if (!content) return null;
  return <LexicalSerializer nodes={content.root.children} />;
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
            text = <del key={index}>{text}</del>;
          }
          if (node.format & IS_UNDERLINE) {
            text = <u key={index}>{text}</u>;
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
              <a href={`#${stringToId(lexicalNodeToTextContent(node))}`}>
                <Tag
                  id={stringToId(lexicalNodeToTextContent(node))}
                  key={index}
                >
                  {serializedChildren}
                </Tag>
              </a>
            );
          }
          case "list": {
            type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
            const Tag: List = node.tag;
            return <Tag key={index}>{serializedChildren}</Tag>;
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
}): JSX.Element {
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
    <div>
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
          <span>{` ${t[locale]["for-event"]} ${item.title}`}</span>
        </Link>
      ) : null}
      {content ? <LexicalSerializer nodes={content.root.children} /> : null}
    </div>
  );
}

function NewsSection({
  newsItem,
  locale,
  order,
}: {
  newsItem: NewsItem;
  locale: "en" | "fi";
  order: string;
}): JSX.Element {
  return (
    <article>
      <h3 id={stringToId(newsItem.title)}>
        {order} {newsItem.title}
      </h3>
      <NewsItemContent item={newsItem} locale={locale} />
    </article>
  );
}

export function NewsletterCategory({
  title,
  newsItems,
  locale,
  order,
}: {
  title: string;
  newsItems: NewsItem[];
  locale: "en" | "fi";
  order: string;
}): JSX.Element | null {
  if (newsItems.length === 0) return null;

  return (
    <div>
      <h2 id={stringToId(title)}>
        {order} {title}
      </h2>
      {newsItems.map((newsItem, i) => (
        <NewsSection
          key={newsItem.id}
          newsItem={newsItem}
          locale={locale}
          order={order + (i + 1).toString()}
        />
      ))}
    </div>
  );
}

export function Calendar({
  eventsThisWeek,
  eventsNextWeek,
  signupsThisWeek,
  locale,
  order,
}: {
  eventsThisWeek: NewsItem[];
  eventsNextWeek: NewsItem[];
  signupsThisWeek: NewsItem[];
  locale: "en" | "fi";
  order: string;
}): JSX.Element | null {
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
    <div>
      <h2 id={stringToId(t[locale].calendar)}>
        {order} {t[locale].calendar}
      </h2>
      {eventsThisWeek.length > 0 ? (
        <div>
          <span>{t[locale]["this-week"]}:</span>
          <ul>
            {eventsThisWeek.toSorted(byDate).map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.date ? (
                  <span>{formatDate(newsItem.date)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {eventsNextWeek.length > 0 ? (
        <div>
          <span>{t[locale]["next-week"]}:</span>
          <ul>
            {eventsNextWeek.toSorted(byDate).map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.date ? (
                  <span>{formatDate(newsItem.date)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {signupsThisWeek.length > 0 ? (
        <div>
          <span>{t[locale]["this-week-signups"]}:</span>
          <ul>
            {signupsThisWeek.toSorted(byDate).map((newsItem) => (
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
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function TableOfContents({
  toc,
}: {
  toc?: TocItem[];
}): JSX.Element | null {
  if (!toc || toc.length === 0) return null;

  return (
    <ol style={{ listStyleType: "none", paddingLeft: "0" }}>
      {toc.map((item, index) => {
        const currentPrefix = `${(index + 1).toString()}.`;
        return (
          <li key={currentPrefix} style={{ margin: "5px" }}>
            {currentPrefix} {item.text}
            {item.children.length > 0 && (
              <ol style={{ listStyleType: "none", paddingLeft: "20px" }}>
                {item.children.map((child, i) => (
                  <li
                    key={`${currentPrefix}${(i + 1).toString()}`}
                    style={{ margin: "5px" }}
                  >
                    {`${currentPrefix}${(i + 1).toString()}.`} {child.text}
                  </li>
                ))}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}

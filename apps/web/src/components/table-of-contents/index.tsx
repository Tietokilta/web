"use client";

import type { EditorState } from "@tietokilta/cms-types/lexical";
import { ChevronDownIcon } from "@tietokilta/ui";
import Link from "next/link";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import {
  cn,
  insertSoftHyphens,
  lexicalNodeToTextContent,
  stringToId,
} from "../../lib/utils";

interface TocItem {
  text: string;
  level: 2 | 3;
}

const generateToc = (content: EditorState): TocItem[] => {
  const toc: TocItem[] = [];

  for (const node of content.root.children) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety
    if (node.type === "heading" && (node.tag === "h2" || node.tag === "h3")) {
      const tag = node.tag;
      const level = parseInt(tag[1], 10) as 2 | 3;
      const text = lexicalNodeToTextContent(node);

      toc.push({
        text,
        level,
      });
    }
  }

  return toc;
};

function HeadingList({
  toc,
  activeHeadingId,
  onHeadingClick,
}: {
  toc: TocItem[];
  activeHeadingId?: string;
  onHeadingClick?: (heading: TocItem) => void;
}) {
  return (
    <ul>
      {toc.map((item) => (
        <li
          className={cn(
            "before:me-[2ch] before:text-gray-600",
            item.level === 2 && "mb-2 text-base before:content-['#'] last:mb-0",
            item.level === 3 && "mb-1 text-sm before:content-['##'] last:mb-0",
          )}
          key={`${item.level}-${item.text}`}
        >
          <Link
            className={cn(
              "underline-offset-2 hover:underline focus-visible:font-bold focus-visible:outline-2 focus-visible:outline-offset-8",
              stringToId(item.text) === activeHeadingId &&
                "font-bold underline",
            )}
            href={`#${stringToId(item.text)}`}
            onClick={() => onHeadingClick?.(item)}
          >
            {insertSoftHyphens(item.text)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Desktop({
  activeHeadingId,
  toc,
  className,
}: {
  activeHeadingId?: string;
  toc: TocItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute h-full -translate-x-[calc(100%+1.5rem)] font-mono",
        className,
      )}
    >
      <nav className="scroll-shadows shadow-solid sticky top-32 max-h-[70dvh] w-64 overflow-y-auto rounded-md border-2 border-gray-900 p-6 2xl:w-72">
        <HeadingList activeHeadingId={activeHeadingId} toc={toc} />
      </nav>
    </div>
  );
}

function Mobile({
  activeHeadingId,
  toc,
  className,
}: {
  activeHeadingId?: string;
  toc: TocItem[];
  className?: string;
}) {
  const activeHeading = toc.find(
    (item) => stringToId(item.text) === activeHeadingId,
  );
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (!activeHeading) return null;

  return (
    <details
      className={cn(
        "group fixed left-0 top-24 -mt-4 flex w-screen flex-col gap-2 bg-gray-100/80 font-mono backdrop-blur-sm",
        className,
      )}
      ref={detailsRef}
    >
      <summary className="flex cursor-pointer items-center justify-between p-4">
        <span
          className={cn(
            "text-2xl font-bold before:me-[2ch] before:text-gray-600",
            activeHeading.level === 2 && "before:content-['#']",
            activeHeading.level === 3 && "before:content-['##']",
          )}
        >
          {activeHeading.text}
        </span>
        <ChevronDownIcon className="h-6 w-6 transition-all group-open:rotate-180" />
      </summary>
      <nav className="px-4 py-2">
        <HeadingList
          activeHeadingId={activeHeadingId}
          onHeadingClick={() => detailsRef.current?.removeAttribute("open")}
          toc={toc}
        />
      </nav>
    </details>
  );
}

const useActiveHeading = () => {
  const [activeId, setActiveId] = useState<string>();

  const headingElementsRef: MutableRefObject<
    Record<string, IntersectionObserverEntry>
  > = useRef({});
  const articleRef = useRef<IntersectionObserverEntry>();
  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      const leadParagraph = entries.at(0);
      const headings =
        leadParagraph?.target.tagName !== "p" ? entries : entries.slice(1);

      articleRef.current = leadParagraph;
      headingElementsRef.current = headings.reduce((map, heading) => {
        map[heading.target.id] = heading;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings: IntersectionObserverEntry[] = [];
      Object.values(headingElementsRef.current).forEach((headingElement) => {
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      if (visibleHeadings.length === 0 && articleRef.current?.isIntersecting) {
        setActiveId(undefined);
        return;
      }

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
        return;
      }

      const getIndexFromId = (id: string) =>
        headingElements.findIndex((heading) => heading.id === id);
      const byIndex = (
        a: IntersectionObserverEntry,
        b: IntersectionObserverEntry,
      ) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id);

      if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(byIndex);
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-96px 0px -60% 0px",
    });

    const leadParagraph = document.querySelector("main p:first-of-type");
    if (leadParagraph) {
      observer.observe(leadParagraph);
    }
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));
    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeId;
};

export function TableOfContents({ content }: { content?: EditorState }) {
  const activeHeadingId = useActiveHeading();

  if (!content) return null;

  const toc = generateToc(content);
  if (toc.length === 0) return null;

  return (
    <>
      <Desktop
        activeHeadingId={activeHeadingId}
        className="hidden xl:block"
        toc={toc}
      />
      <Mobile
        activeHeadingId={activeHeadingId}
        className="xl:hidden"
        toc={toc}
      />
    </>
  );
}

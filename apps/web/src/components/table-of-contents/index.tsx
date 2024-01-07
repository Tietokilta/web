"use client";

import { ChevronDownIcon } from "@tietokilta/ui";
import Link from "next/link";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { cn, lexicalNodeToTextContent } from "../../lib/utils";
import type { SerializedLexicalEditorState } from "../lexical/types";

interface TocItem {
  text: string;
  level: 2 | 3;
}

const generateToc = (content: SerializedLexicalEditorState): TocItem[] => {
  const toc: TocItem[] = [];

  for (const node of content.root.children) {
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
            item.level === 2 && "mb-2 before:content-['#'] last:mb-0",
            item.level === 3 && "mb-1 text-sm before:content-['##'] last:mb-0",
          )}
          key={`${item.level}-${item.text}`}
        >
          <Link
            className={cn(
              "underline-offset-2 hover:underline",
              item.level === 3 && "text-sm",
              item.text.toLocaleLowerCase().replace(/\s/g, "-") ===
                activeHeadingId && "font-bold underline",
            )}
            href={`#${item.text.toLocaleLowerCase().replace(/\s/g, "-")}`}
            onClick={() => onHeadingClick?.(item)}
          >
            {item.text}
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
        "absolute h-full -translate-x-[calc(100%+1.5rem)]",
        className,
      )}
    >
      <nav className="shadow-solid sticky top-32 w-72 rounded-md border-2 border-gray-900 p-6">
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
    (item) =>
      item.text.toLocaleLowerCase().replace(/\s/g, "-") === activeHeadingId,
  );
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (!activeHeading) return null;

  return (
    <details
      className={cn(
        "group sticky top-20 -mx-4 -mt-4 flex w-[calc(100%+2rem)] flex-col gap-2 bg-gray-100/80 p-4 backdrop-blur-sm",
        className,
      )}
      ref={detailsRef}
    >
      <summary className="flex justify-between">
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
      <nav className="py-2">
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
  const [activeId, setActiveId] = useState<string | undefined>();

  const headingElementsRef: MutableRefObject<
    Record<string, IntersectionObserverEntry>
  > = useRef({});
  useEffect(() => {
    const callback: IntersectionObserverCallback = (headings) => {
      headingElementsRef.current = headings.reduce((map, heading) => {
        map[heading.target.id] = heading;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings: IntersectionObserverEntry[] = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id: string) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(b.target.id) - getIndexFromId(a.target.id),
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-96px 0px -60% 0px",
    });

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

export function TableOfContents({
  content,
}: {
  content?: SerializedLexicalEditorState;
}) {
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

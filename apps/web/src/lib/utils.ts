import type { Node } from "@tietokilta/cms-types/lexical";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const localisePath = (path: string, locale: string) =>
  `/${locale}${path}` as const;

export const jsxToTextContent = (element: JSX.Element | undefined): string => {
  if (!element) return "";

  if (typeof element === "string") return element;

  const props = element.props as Record<string, unknown>;
  const children = props.children as JSX.Element | JSX.Element[] | undefined;

  if (children instanceof Array) {
    return children.map(jsxToTextContent).join("");
  }

  return jsxToTextContent(children);
};

export const lexicalNodeToTextContent = (node: Node): string => {
  if (!("children" in node)) {
    if (node.type === "text") return node.text;

    return "";
  }

  const children = (node.children ?? []) as Node[];
  return children.map((child) => lexicalNodeToTextContent(child)).join("");
};

export const stringToId = (string: string): string =>
  string.toLocaleLowerCase().replace(/\s/g, "-");

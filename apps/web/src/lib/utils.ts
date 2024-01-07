import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SerializedLexicalNode } from "../components/lexical/types";

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

export const lexicalNodeToTextContent = (node: SerializedLexicalNode): string =>
  node.children?.map((child) => child.text ?? "").join("") ?? "";

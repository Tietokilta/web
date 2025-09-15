import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import type { EditorState } from "@lexical-types";
import { fetchLandingPage } from "@lib/api/landing-page";
import { fetchPage } from "@lib/api/pages";
import { lexicalNodeToTextContent } from "@lib/utils";

// Lightweight serializer: extend as needed for more node types
function serializeLexicalToMarkdown(content?: EditorState): string {
  if (!content) return "";
  const lines: string[] = [];
  for (const node of content.root.children) {
    switch (node.type) {
      case "heading": {
        const level = parseInt(node.tag[1] ?? "2", 10);
        const text = lexicalNodeToTextContent(node);
        lines.push(`${"#".repeat(level)} ${text}`);
        break;
      }
      case "paragraph": {
        const text = lexicalNodeToTextContent(node);
        if (text.trim()) lines.push(text);
        break;
      }
      case "list": {
        for (const item of node.children ?? []) {
          if (item.type === "listitem") {
            const text = lexicalNodeToTextContent(item);
            const bullet = node.tag === "ol" ? "1." : "-";
            if (text.trim()) lines.push(`${bullet} ${text}`);
          }
        }
        break;
      }
      default: {
        const text = lexicalNodeToTextContent(node as any);
        if (text.trim()) lines.push(text);
      }
    }
  }
  return lines.join("\n\n").trim();
}

async function getPage(locale: string, segments: string[]) {
  if (segments.length === 0) return null; // handled separately as landing page
  if (segments.length !== 1 && segments.length !== 2) return null;
  const pagePath = `/${segments.join("/")}`;
  const fullPath = `/${locale}${pagePath}`;
  return fetchPage({ where: { path: { equals: fullPath } }, locale });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") ?? "fi"; // fallback
  const rawPath = url.searchParams.get("path") ?? "";
  const segments = rawPath.split("/").filter(Boolean);

  if (segments.length === 0) {
    // Landing page variant
    const landing = await fetchLandingPage(locale)({});
    if (!landing) return notFound();
    const body = landing.body as unknown as EditorState | undefined;
    const markdown = [
      `# ${landing.heroTexts?.[0]?.text ?? "Tietokilta"}`,
      "",
      serializeLexicalToMarkdown(body),
    ]
      .filter(Boolean)
      .join("\n");
    return new NextResponse(markdown + "\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const page = await getPage(locale, segments);
  if (!page || page.type !== "standard") return notFound();
  const content = page.content as unknown as EditorState | undefined;
  const markdown = [
    `# ${page.title}`,
    "",
    page.description,
    "",
    serializeLexicalToMarkdown(content),
  ]
    .filter(Boolean)
    .join("\n");
  return new NextResponse(markdown + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

import { NextResponse } from "next/server";
import type { EditorState } from "@lexical-types";
import { fetchLandingPage } from "@lib/api/landing-page";
import { getCurrentLocale } from "@locales/server";
import { lexicalNodeToTextContent } from "@lib/utils";

function serializeLexicalToMarkdown(content?: EditorState): string {
  if (!content) return "";
  const lines: string[] = [];
  for (const node of content.root.children) {
    if (node.type === "heading") {
      const level = parseInt(node.tag[1] ?? "2", 10);
      const text = lexicalNodeToTextContent(node);
      lines.push(`${"#".repeat(level)} ${text}`);
      continue;
    }
    if (node.type === "paragraph") {
      const text = lexicalNodeToTextContent(node);
      if (text.trim().length > 0) lines.push(text);
      continue;
    }
  }
  return lines.join("\n\n").trim();
}

export async function GET() {
  const locale = await getCurrentLocale();
  const landingPageData = await fetchLandingPage(locale)({});
  if (!landingPageData) {
    return new NextResponse("Landing page not found", { status: 404 });
  }
  const body = landingPageData.body as unknown as EditorState | undefined;
  const markdown = [`# Tietokilta`, "", serializeLexicalToMarkdown(body)]
    .filter(Boolean)
    .join("\n");
  return new NextResponse(markdown + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

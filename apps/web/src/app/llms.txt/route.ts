import { NextResponse } from "next/server";
// List index describing available llms.txt endpoints per locale

export async function GET() {
  // We cannot query all pages without pagination yet, rely on existing sitemap approach later if needed
  // For now provide informational header and instructions
  const header = `# llms.txt index`;
  const body = [
    header,
    "",
    "Each content page exposes a Markdown variant at the same path with /llms.txt appended.",
    "Examples:",
    `- /llms.txt (this file)`,
    `- /[locale]/some-page/llms.txt`,
    `- /[locale]/topic/page-slug/llms.txt`,
    "",
    "Root landing page variant: /[locale]/llms.txt",
    "",
    "Available locales: fi, en",
  ].join("\n");
  return new NextResponse(body + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

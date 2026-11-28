import type { Root } from "mdast";
import type { Plugin } from "unified";

export const ALERT_TYPES = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

const MARKER =
  /^\[!(note|tip|important|warning|caution)\][ \t]*(\r\n|\r|\n|$)/i;

/**
 * Mark GitHub-style alert blockquotes so they can be rendered as callouts.
 *
 * ```markdown
 * > [!WARNING]
 * > Signup is binding.
 * ```
 *
 * Like GitHub, only top-level blockquotes whose first line is just the marker
 * and that have content after it count. The marker is removed and the
 * blockquote gets a `data-alert` attribute with the lowercase type. Other
 * blockquotes are left untouched.
 *
 * Syntax: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */
export const remarkGfmAlerts: Plugin<[], Root> = () => (tree) => {
  for (const node of tree.children) {
    if (node.type !== "blockquote") continue;
    const paragraph = node.children[0];
    if (paragraph?.type !== "paragraph") continue;
    const text = paragraph.children[0];
    if (text?.type !== "text") continue;

    const match = MARKER.exec(text.value);
    if (!match) continue;

    const rest = text.value.slice(match[0].length);
    // The marker line ended inside this text node, or right after it with a
    // hard break (which ends the marker line) or the end of the paragraph.
    const next = paragraph.children[1];
    const endsAtNewline = match[2] !== "";
    if (!endsAtNewline && rest === "" && next && next.type !== "break") {
      continue;
    }

    const children = paragraph.children.slice(1);
    if (!endsAtNewline && next?.type === "break") children.shift();
    if (rest !== "") children.unshift({ ...text, value: rest });

    const body = node.children.slice(1);
    if (children.length > 0) body.unshift({ ...paragraph, children });
    const hasContent = body.some(
      (child) =>
        child.type !== "definition" &&
        !(child.type === "html" && /^\s*<!--[\s\S]*-->\s*$/.test(child.value)),
    );
    if (!hasContent) continue;

    node.children = body;
    node.data = {
      ...node.data,
      hProperties: {
        ...node.data?.hProperties,
        "data-alert": match[1].toLowerCase(),
      },
    };
  }
};

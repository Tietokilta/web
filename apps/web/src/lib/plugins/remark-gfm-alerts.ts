import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const ALERT_TYPES = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

const MARKER = /^\[!(note|tip|important|warning|caution)\][^\S\n]*(?:\n|$)/i;

/**
 * Mark GitHub-style alert blockquotes so they can be rendered as callouts.
 *
 * ```markdown
 * > [!WARNING]
 * > Signup is binding.
 * ```
 *
 * The marker is removed and the blockquote gets a `data-alert` attribute with
 * the lowercase type. Other blockquotes are left untouched.
 */
export const remarkGfmAlerts: Plugin<[], Root> = () => (tree) => {
  visit(tree, "blockquote", (node) => {
    const paragraph = node.children[0];
    if (paragraph?.type !== "paragraph") return;
    const text = paragraph.children[0];
    if (text?.type !== "text") return;

    const match = MARKER.exec(text.value);
    if (!match) return;

    text.value = text.value.slice(match[0].length);
    if (text.value === "") paragraph.children.shift();
    if (paragraph.children[0]?.type === "break") paragraph.children.shift();
    if (paragraph.children.length === 0) node.children.shift();

    node.data = {
      ...node.data,
      hProperties: { "data-alert": match[1].toLowerCase() },
    };
  });
};

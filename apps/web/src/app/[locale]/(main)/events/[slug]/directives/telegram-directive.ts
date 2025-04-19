import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { TextDirective } from "mdast-util-directive";
import type { Node } from "unist";
import type { Text } from "mdast";

interface TelegramDirective extends TextDirective {
  name: "tg";
  children: Text[];
}

const isTelegramDirective = (node: Node): node is TelegramDirective =>
  node.type === "textDirective" && (node as TextDirective).name === "tg";

export const telegramDirective: Plugin = () => {
  return (tree) => {
    visit(tree, isTelegramDirective, (node) => {
      const username = node.children[0].value;
      if (typeof username !== "string" || username === "") return;

      node.data = {
        hName: "a",
        hProperties: {
          target: "_blank",
          href: `https://t.me/${username}`,
        },
        hChildren: [
          {
            type: "text",
            value: `@${username}`,
          },
        ],
      };
    });
  };
};

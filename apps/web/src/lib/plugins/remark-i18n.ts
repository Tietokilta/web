import type { Plugin } from "unified";
import type { Root, Definition, Parent } from "mdast";
import { visit } from "unist-util-visit";

interface Options {
  locale?: string;
}

/**
 * Split markdown content into multiple trees based on language definitions.
 *
 * Example:
 * ```markdown
 * Default language content
 *
 * [lang]: # (en)
 * English content
 * ```
 *
 * Will be transformed depending on the locale option to either:
 * ```markdown
 * Default language content
 * ```
 *
 * or:
 *
 * ```markdown
 * English content
 * ```
 */
export const remarkI18n: Plugin<[options: Options] | undefined[], Root> =
  function (options = {}, ..._ignored) {
    const defaultLocaleTree: Root = { type: "root", children: [] };
    const localeTrees = new Map<string, Root>();

    return (tree: Root) => {
      let currentLocale: string | null = null;
      let lastDefinitionIndex = -1;

      // Find all language definitions and split content
      visit(
        tree,
        "definition",
        (node: Definition, index?: number, parent?: Parent) => {
          const isLangDefinition =
            node.label === "lang" &&
            node.identifier === "lang" &&
            node.url === "#";
          if (!isLangDefinition || !node.title) {
            return;
          }

          const locale = node.title;
          if (!localeTrees.has(locale)) {
            localeTrees.set(locale, { type: "root", children: [] });
          }

          // Move nodes between last definition and this one to appropriate tree
          const targetTree = currentLocale
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked above
              localeTrees.get(currentLocale)!
            : defaultLocaleTree;

          const nodesToMove =
            parent?.children.slice(lastDefinitionIndex + 1, index) ?? [];
          targetTree.children.push(...nodesToMove);

          currentLocale = locale;
          lastDefinitionIndex = index ?? -1;
        },
      );

      // Handle remaining nodes after the last definition
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety just in case
      if (tree.type === "root") {
        const remainingNodes = tree.children.slice(lastDefinitionIndex + 1);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false negative
        const targetTree = currentLocale
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's there because of the last definition
            localeTrees.get(currentLocale)!
          : defaultLocaleTree;
        targetTree.children.push(...remainingNodes);
      }

      const cleanTree = (_tree: Root) => {
        _tree.children = _tree.children.filter(
          (node) =>
            !(
              node.type === "definition" &&
              node.label === "lang" &&
              node.url === "#"
            ),
        );
      };

      cleanTree(defaultLocaleTree);
      localeTrees.forEach(cleanTree);

      // Return the appropriate tree based on options
      if (options.locale && localeTrees.has(options.locale)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked above
        return localeTrees.get(options.locale)!;
      }

      return defaultLocaleTree;
    };
  };

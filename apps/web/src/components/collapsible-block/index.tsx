import { ChevronDownIcon } from "@tietokilta/ui";
import type { JSX } from "react";
import type { Node } from "@lexical-types";

interface CollapsibleBlockProps {
  header: string;
  content: Node[];
  Renderer: React.ComponentType<{ nodes: Node[] }>;
}

export function CollapsibleBlock({
  header,
  content,
  Renderer,
}: CollapsibleBlockProps): JSX.Element {
  return (
    <div className="not-prose relative my-4 flex overflow-hidden rounded-md border-2 border-gray-900 px-2 pt-11 font-mono shadow-solid md:px-3">
      <details className="group contents">
        <summary className="absolute top-0 left-0 flex w-full cursor-pointer justify-between border-b-2 border-gray-900 bg-gray-100 p-2 md:px-3 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
          <p className="self-center truncate font-medium">{header}</p>
          <ChevronDownIcon className="size-6 transition-all group-open:rotate-180" />
        </summary>
        <div className="py-2">
          <Renderer nodes={content} />
        </div>
      </details>
    </div>
  );
}

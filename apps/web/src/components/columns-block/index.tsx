import type { CSSProperties, JSX } from "react";
import type { ColumnsBlockNode, Node } from "@lexical-types";

interface ColumnsBlockProps {
  columns: ColumnsBlockNode["fields"]["columns"];
  Renderer: React.ComponentType<{ nodes: Node[] }>;
}

export function ColumnsBlock({
  columns,
  Renderer,
}: ColumnsBlockProps): JSX.Element {
  const style: CSSProperties = {
    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
  };
  return (
    <div className="my-4 flex flex-col gap-6 md:grid" style={style}>
      {columns.map((column, index) => (
        // eslint-disable-next-line react/no-array-index-key -- stable order
        <div key={column.id ?? index}>
          <Renderer nodes={column.content.root.children} />
        </div>
      ))}
    </div>
  );
}

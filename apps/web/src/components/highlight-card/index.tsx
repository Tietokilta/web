import { Card } from "@tietokilta/ui";
import React from "react";
import { type Node, type HighlightCardBlockNode } from "@lexical-types";

interface RendererProps {
  nodes: Node[];
}

export function HighlightCard({
  content,
  Renderer,
}: {
  content: HighlightCardBlockNode["fields"]["content"];
  // Pass LexicalSerializer as a prop, otherwise introduces a cyclical import
  Renderer: React.ComponentType<RendererProps>;
}) {
  return (
    <Card className="not-prose text-black">
      <Renderer nodes={content.root.children} />
    </Card>
  );
}

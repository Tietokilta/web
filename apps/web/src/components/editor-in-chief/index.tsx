import { type EditorInChiefBlockNode } from "@tietokilta/cms-types/lexical";

export function EditorInChief({
  name,
  type,
}: {
  name: EditorInChiefBlockNode["fields"]["name"];
  type: EditorInChiefBlockNode["fields"]["type"];
}) {
  switch (type) {
    case "boring":
      return Boring(name);
  }
}

function Boring(name: string) {
  return <>{name}</>;
}

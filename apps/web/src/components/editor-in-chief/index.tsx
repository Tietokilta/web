"use client";

import { type EditorInChiefBlockNode } from "@lexical-types";
import { useDvdScreensaver } from "./use-dvd-screensaver";

export function EditorInChief({
  name,
  type,
}: {
  name: EditorInChiefBlockNode["fields"]["name"];
  type: EditorInChiefBlockNode["fields"]["type"];
}) {
  switch (type) {
    case "boring":
      return <>{name}</>;
    case "dvd":
      return <DvdEditor name={name} />;
  }

  return null;
}

function DvdEditor({ name }: { name: string }) {
  const { containerRef, elementRef } = useDvdScreensaver({ speed: 2 });

  return (
    <div
      className="screensaver-container relative h-52 w-full overflow-hidden md:h-80"
      ref={containerRef}
    >
      <p
        className="absolute top-0 left-0 m-0 w-fit font-mono text-lg font-bold md:text-2xl"
        ref={elementRef}
      >
        🔥 {name} 🔥
      </p>
    </div>
  );
}

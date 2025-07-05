"use client";

import { DvdScreensaver } from "react-dvd-screensaver";
import { useEffect, useState } from "react";
import { type EditorInChiefBlockNode } from "@lexical-types";

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
    case "dvd":
      return DVD(name);
  }
}

function Boring(name: string) {
  return <>{name}</>;
}

function DVD(name: string) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="screensaver-container h-52 w-full md:h-80">
      {!!isClient && (
        <DvdScreensaver speed={2}>
          <p className="m-0 w-fit font-mono text-lg font-bold md:text-2xl">
            🔥 {name} 🔥
          </p>
        </DvdScreensaver>
      )}
    </div>
  );
}

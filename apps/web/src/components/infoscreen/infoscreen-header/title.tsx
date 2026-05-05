"use client";
import { useInfoscreenTitle } from "./title-context";

export function InfoscreenTitle() {
  const { title } = useInfoscreenTitle();
  if (!title) {
    return <div className="flex-1" />;
  }
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <h1 className="text-center font-mono text-4xl font-bold">{title}</h1>
    </div>
  );
}

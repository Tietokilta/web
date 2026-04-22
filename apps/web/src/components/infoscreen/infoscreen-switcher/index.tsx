"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInfoscreenTitle } from "@components/infoscreen/infoscreen-header/title-context";

export interface InfoScreenItem {
  title: string;
  content: React.ReactNode;
}

export default function InfoScreenSwitcher({
  items,
}: {
  items: InfoScreenItem[];
}) {
  const [current, setCurrent] = useState(0);
  const count = items.length;
  const activeIndex = count === 0 ? 0 : current % count;
  const activeTitle = items[activeIndex]?.title ?? null;
  const router = useRouter();
  const { setTitle } = useInfoscreenTitle();

  useEffect(() => {
    setTitle(activeTitle);
    return () => {
      setTitle(null);
    };
  }, [activeTitle, setTitle]);

  useEffect(() => {
    if (count === 0) return undefined;
    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
      router.refresh();
    }, 15000); // Change screen every x seconds
    return () => {
      clearInterval(intervalId);
    };
  }, [count, router]);

  if (count === 0) {
    return (
      <div className="flex h-full flex-col">
        error, no info screen components functional
      </div>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: index === activeIndex ? "block" : "none",
            width: "100%",
            height: "100%",
          }}
        >
          {item.content}
        </div>
      ))}
    </>
  );
}

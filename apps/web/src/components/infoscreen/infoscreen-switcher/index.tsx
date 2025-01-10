"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InfoScreenSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const count = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);
  const router = useRouter();

  useEffect(() => {
    const setNextChild = () => {
      setCurrent((prev) => (prev + 1) % count);
      router.refresh();
    };

    const intervalId = setInterval(setNextChild, 15000); // Change screen every x seconds

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [count, router]);

  return <div className="flex h-full flex-col">{childrenArray[current]}</div>;
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTruthy } from "remeda";

export default function InfoScreenSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const childrenArray = React.Children.toArray(children).filter(isTruthy);
  const count = childrenArray.length;
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
  if (childrenArray.length === 0) {
    return (
      <div className="flex h-full flex-col">
        error, no info screen components functional
      </div>
    );
  }

  return <>{childrenArray[current]}</>;
}

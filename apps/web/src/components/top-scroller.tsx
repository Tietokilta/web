"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function TopScroller() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isScrollTop = searchParams.has("scroll-top");
    if (isScrollTop) {
      const cloneSearchParams = new URLSearchParams(searchParams);
      cloneSearchParams.delete("scroll-top");
      window.scrollTo(0, 0);
      router.replace({
        search: cloneSearchParams.toString(),
        hash: "#top",
      });
    }
  }, [searchParams, router]);

  return null;
}

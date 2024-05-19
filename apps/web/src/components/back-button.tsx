"use client";

import { useRouter } from "next/navigation";
import { Button } from "@tietokilta/ui";

export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Button
      variant="backLink"
      className="dark:text-dark-text"
      onClick={() => {
        router.back();
      }}
    >
      {children}
    </Button>
  );
}

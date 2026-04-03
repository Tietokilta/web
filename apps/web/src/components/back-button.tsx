"use client";

import { Button } from "@tietokilta/ui";
import { useRouter } from "next/navigation";

export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Button
      variant="backLink"
      onClick={() => {
        router.back();
      }}
    >
      {children}
    </Button>
  );
}

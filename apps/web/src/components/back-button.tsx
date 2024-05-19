"use client";

import { useRouter } from "next/navigation";
import { Button } from "@tietokilta/ui";

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

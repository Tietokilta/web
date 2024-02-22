"use client";

import { useRouter } from "next/navigation";
import { Button } from "@tietokilta/ui";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="backLink"
      onClick={() => {
        router.back();
      }}
    >
      Takaisin
    </Button>
  );
}
